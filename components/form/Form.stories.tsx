import { Meta, Story } from '@storybook/react';
import Button from 'components/inputs/Button';
import { FieldError } from 'react-hook-form';
import { Form } from './Form';
import { FormDrawer } from './FormDrawer';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import TimeRangePicker from './TimeRangeField';

type FormValues = {
  title: string;
  type: string;
  content: string;
  duration: string[];
};

const grouped = [
  {
    optgroup: 'Vokswagen',
    options: [
      { label: 'Golf', value: 'golf' },
      { label: 'ID 3', value: 'id3' },
    ],
  },
  {
    optgroup: 'Tesla',
    options: [
      { label: 'Model 3', value: 'model3' },
      { label: 'Model 5', value: 'model5' },
    ],
  },
];

const MyForm = ({ hideSubmit = false }: { hideSubmit?: boolean }) => {
  return (
    <div className="max-w-lg mx-auto">
      <Form<FormValues>
        onSubmit={async (values) => {
          alert(JSON.stringify(values, null, 2));
        }}
        id="my-form"
      >
        {({ register, formState, control }) => (
          <>
            <InputField
              label="Title"
              error={formState.errors['title']}
              registration={register('title')}
            />

            <SelectField
              label="Team"
              error={formState.errors['type']}
              registration={register('type')}
              groupedOptions={grouped}
            />

            <TimeRangePicker
              name="duration"
              label="Duration"
              control={control}
              error={formState.errors['duration'] as FieldError | undefined}
            />

            {!hideSubmit && (
              <div>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </div>
            )}
          </>
        )}
      </Form>
    </div>
  );
};

const meta: Meta = {
  title: 'form/Form',
  component: MyForm,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = () => <MyForm />;

export const Default = Template.bind({});
Default.args = {};

export const AsFormDrawer = () => {
  return (
    <FormDrawer
      triggerButton={<Button>Open Form</Button>}
      isDone={true}
      size="lg"
      title="Form Drawer Example"
      submitButton={
        <Button form="my-form" type="submit">
          Submit
        </Button>
      }
    >
      <MyForm hideSubmit />
    </FormDrawer>
  );
};
