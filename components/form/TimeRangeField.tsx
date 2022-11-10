import { TimePicker } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { generateTimeRange, timeFormat } from 'lib/client/date-utilities';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

// https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
// type DefaultValue = [EventValue<Moment>, EventValue<Moment>];

type TimeRangePickerProps<T extends FieldValues> =
  FieldWrapperPassThroughProps & UseControllerProps<T> & { name: string };

const defaultStartTime = '09:00';
const defaultEndTime = '17:00';

const TimeRangePicker = <T extends FieldValues>({
  label,
  error,
  defaultValue,
  ...props
}: TimeRangePickerProps<T>) => {
  const { field } = useController<T>({
    ...props,
    defaultValue: defaultValue?.length
      ? generateTimeRange({
          startTime: defaultValue[0],
          endTime: defaultValue[1],
        })
      : (generateTimeRange({
          startTime: defaultStartTime,
          endTime: defaultEndTime,
        }) as any),
  });
  return (
    <FieldWrapper label={label} error={error}>
      <TimePicker.RangePicker
        {...field}
        format={timeFormat}
        allowClear={false}
        className="w-full"
      />
    </FieldWrapper>
  );
};

export default TimeRangePicker;
