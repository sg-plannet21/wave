import { DatePicker } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { createUtcDateRange } from 'lib/client/date-utilities';
import moment from 'moment';
import getConfig from 'next/config';
import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

const { dateFormat } = getConfig();

type DateRangePickerProps<T extends FieldValues> =
  FieldWrapperPassThroughProps & UseControllerProps<T> & { name: string };

const localStartDate = moment().add(1, 'days').startOf('day').hours(9); // tomorrow 9am local time
const localEndDate = moment(localStartDate).hours(18);

// convert to UTC moment instances
const [defaultStartDate, defaultEndDate] = [localStartDate, localEndDate].map(
  (date) => moment.utc(moment(date, dateFormat))
);

const DateRangePicker = <T extends FieldValues>({
  label,
  error,
  defaultValue,
  ...props
}: DateRangePickerProps<T>) => {
  const { field } = useController<T>({
    ...props,
    defaultValue: defaultValue?.length
      ? createUtcDateRange({
          startDate: defaultValue[0],
          endDate: defaultValue[1],
        })
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ([defaultStartDate, defaultEndDate] as any),
  });
  return (
    <FieldWrapper label={label} error={error}>
      <DatePicker.RangePicker
        {...field}
        format={dateFormat}
        allowClear={false}
        className="w-full"
        minuteStep={15}
        placement="bottomLeft"
        showTime={true}
        disabledDate={(current) => current?.isBefore(moment().startOf('day'))}
      />
    </FieldWrapper>
  );
};

export default DateRangePicker;
