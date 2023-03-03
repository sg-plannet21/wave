import Drawer from 'components/feedback/drawer';
import DateRangePicker from 'components/form/DateRangeField';
import { Insights } from 'components/icons';
import Button from 'components/inputs/button';
import moment, { Moment } from 'moment';
import { useState } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import { useDisclosure } from 'state/hooks/useDisclosure';
import { z } from 'zod';

type HistoricalCallflowProps = {
  name: string;
  businessUnit: string;
};
const startDate = moment().weekday(-7).startOf('day').hours(9);
const endDate = moment(startDate).add(5).hours(18);

const schema = z.object({
  dateRange: z.array(z.string()),
});

type HistoricalCallflowFormValues = z.infer<typeof schema>;
const height = 600;

const HistoricalCallflow: React.FC<HistoricalCallflowProps> = ({
  businessUnit,
  name,
}) => {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const { control, handleSubmit, formState } =
    useForm<HistoricalCallflowFormValues>({
      defaultValues: {
        dateRange: [startDate.toISOString(), endDate.toISOString()],
      },
    });
  const { isOpen, close, open } = useDisclosure();

  function onSumbit(values: HistoricalCallflowFormValues) {
    const url = `${
      process.env.NEXT_PUBLIC_CALLFLOW_URL
    }/ephistorical?bu=${businessUnit}&ep=${name}&start=${moment(
      values.dateRange[0]
    ).format()}&end=${moment(values.dateRange[1]).format()}&height=${height}`;

    setIframeUrl(encodeURI(url));
  }
  return (
    <>
      <div className="text-center">
        <button
          className="text-emerald-600 dark:text-emerald-400 transition-transform hover:scale-110"
          onClick={open}
        >
          <Insights className="w-5 h-5" />
        </button>
      </div>
      <Drawer
        title={`${name} historical call flow.`}
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
            name="dateRange"
            render={(props) => (
              <DateRangePicker
                error={formState.errors['dateRange'] as FieldError | undefined}
                label="Time Range"
                value={
                  props.field.value.map((date: string) => moment(date)) as [
                    Moment,
                    Moment
                  ]
                }
                onChange={(values) => {
                  props.field.onChange(
                    values && values.map((date) => moment(date).toISOString())
                  );
                }}
              />
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

export default HistoricalCallflow;
