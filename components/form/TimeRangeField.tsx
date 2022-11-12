import { TimePicker } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { createUtcTimeRange, timeFormat } from 'lib/client/date-utilities';
import moment from 'moment';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type TimeRangePickerProps<T extends FieldValues> =
  FieldWrapperPassThroughProps & UseControllerProps<T> & { name: string };

const [defaultStartTime, defaultEndTime] = ['09:00', '17:00'].map((time) =>
  moment.utc(moment(time, timeFormat))
);

const TimeRangePicker = <T extends FieldValues>({
  label,
  error,
  defaultValue,
  ...props
}: TimeRangePickerProps<T>) => {
  const { field } = useController<T>({
    ...props,
    defaultValue: defaultValue?.length
      ? createUtcTimeRange({
          startTime: defaultValue[0],
          endTime: defaultValue[1],
        })
      : ([defaultStartTime, defaultEndTime] as any),
  });
  return (
    <FieldWrapper label={label} error={error}>
      <TimePicker.RangePicker
        {...field}
        format={timeFormat}
        allowClear={false}
        minuteStep={15}
        className="w-full"
      />
    </FieldWrapper>
  );
};

export default TimeRangePicker;