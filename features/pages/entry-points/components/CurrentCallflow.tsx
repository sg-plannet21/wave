import { DatePicker } from 'antd';
import Drawer from 'components/feedback/drawer';
import { FieldWrapper } from 'components/form/FieldWrapper';
import { Callflow } from 'components/icons';
import Button from 'components/inputs/button';
import moment from 'moment';
import getConfig from 'next/config';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDisclosure } from 'state/hooks/useDisclosure';
import { z } from 'zod';

const {
  publicRuntimeConfig: { dateFormat },
} = getConfig();

type CurrentCallflowProps = {
  entryPointId: string;
  name: string;
  businessUnit: string;
};

const now = moment().startOf('hour');

const schema = z.object({
  date: z.string(),
});

type CurrentCallflowFormValues = z.infer<typeof schema>;
const height = 600;

const CurrentCallflow: React.FC<CurrentCallflowProps> = ({
  businessUnit,
  entryPointId,
  name,
}) => {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const { control, handleSubmit, formState } =
    useForm<CurrentCallflowFormValues>({
      defaultValues: {
        date: now.toISOString(),
      },
    });
  const { isOpen, close, open } = useDisclosure();

  function onSumbit(values: CurrentCallflowFormValues) {
    const url = `${
      process.env.NEXT_PUBLIC_CALLFLOW_URL
    }/epcallflow?bu=${businessUnit}&ep=${entryPointId}&start=${moment(
      values.date
    ).format()}&height=${height}`;

    setIframeUrl(encodeURI(url));
  }
  return (
    <>
      <div className="text-center">
        <button
          className="text-indigo-600 dark:text-indigo-400 transition-transform hover:scale-110"
          onClick={open}
        >
          <Callflow className="w-5 h-5" />
        </button>
      </div>
      <Drawer
        title={`${name} Current call flow.`}
        isOpen={isOpen}
        onClose={close}
        size="lg"
        renderFooter={() => (
          <Button onClick={close} variant="inverse" size="sm">
            Close
          </Button>
        )}
      >
        <form
          onSubmit={handleSubmit(onSumbit)}
          className="max-w-md flex items-end w-full space-x-3"
        >
          <Controller
            control={control}
            name="date"
            render={(props) => (
              <FieldWrapper label="Date" error={formState.errors['date']}>
                <DatePicker
                  allowClear={false}
                  format={dateFormat}
                  className="w-full"
                  minuteStep={15}
                  placement="bottomLeft"
                  showTime={true}
                  value={moment(props.field.value)}
                  onChange={(value) =>
                    props.field.onChange(value?.toISOString())
                  }
                />
              </FieldWrapper>
            )}
          />
          <Button type="submit" size="sm" className="mb-1">
            Apply
          </Button>
        </form>
        {iframeUrl && (
          <iframe
            title={`${name} - Current Callflow`}
            width="100%"
            height={`${height}px`}
            src={iframeUrl}
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </Drawer>
    </>
  );
};

export default CurrentCallflow;
