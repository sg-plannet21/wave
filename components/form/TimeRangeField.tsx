import { TimePicker } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { timeFormat } from 'lib/client/date-utilities';
import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type TimeRangePickerProps<T extends FieldValues> =
  FieldWrapperPassThroughProps & UseControllerProps<T> & { name: string };

const TimeRangePicker = <T extends FieldValues>({
  label,
  error,
  ...props
}: TimeRangePickerProps<T>) => {
  const { field } = useController<T>({
    ...props,
  });
  return (
    <FieldWrapper label={label} error={error}>
      <TimePicker.RangePicker
        {...field}
        format={timeFormat}
        allowClear={false}
        minuteStep={15}
        className="w-full"
        placement="bottomLeft"
      />
    </FieldWrapper>
  );
};

export default TimeRangePicker;
