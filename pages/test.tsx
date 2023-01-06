import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import React, { useState } from 'react';
import { Control, useController, useForm } from 'react-hook-form';
import { NextPageWithLayout } from './page';

let renderCount = 0;

type CheckboxesProps = {
  options: string[];
  control: Control;
  name: string;
};

const Checkboxes = ({ options, control, name }: CheckboxesProps) => {
  const { field } = useController({
    control,
    name,
  });
  const [value, setValue] = React.useState(field.value || []);

  return (
    <>
      {options.map((option, index) => (
        <input
          onChange={(e) => {
            const valueCopy = [...value];

            // update checkbox value
            valueCopy[index] = e.target.checked ? e.target.value : null;

            // send data to react hook form
            field.onChange(valueCopy);

            // update local state
            setValue(valueCopy);
          }}
          key={option}
          type="checkbox"
          checked={value.includes(option)}
          value={option}
        />
      ))}
    </>
  );
};

type FormVals = {
  controlled: string[];
  uncontrolled: string[];
};

const Test: NextPageWithLayout = () => {
  const [submitted, setSubmitted] = useState<FormVals>();

  const { register, handleSubmit, control } = useForm<FormVals>({
    defaultValues: {
      controlled: ['a'],
      uncontrolled: ['A'],
    },
  });

  const onSubmit = (data: FormVals) => setSubmitted(data);
  renderCount++;

  return (
    <div>
      <p>renderCount {renderCount}</p>
      <p>
        Performant, flexible and extensible forms with easy-to-use validation.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <h2>uncontrolled</h2>
          <input {...register('uncontrolled')} type="checkbox" value="A" />
          <input {...register('uncontrolled')} type="checkbox" value="B" />
          <input {...register('uncontrolled')} type="checkbox" value="C" />
        </section>

        <section>
          <h2>controlled</h2>
          <Checkboxes
            options={['a', 'b', 'c']}
            control={control}
            name="controlled"
          />
        </section>
        <input type="submit" />
      </form>
      {submitted && (
        <div>
          Submitted Data:
          <br />
          {JSON.stringify(submitted)}
        </div>
      )}
    </div>
  );
};

export default Test;

Test.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
