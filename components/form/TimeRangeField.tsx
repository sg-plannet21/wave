import { TimePicker } from 'antd';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { generateTimeRange, timeFormat } from '../../lib/client/date-utilities';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

// https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
// type DefaultValue = [EventValue<Moment>, EventValue<Moment>];

type TimeRangePickerProps<T extends FieldValues> =
  FieldWrapperPassThroughProps & UseControllerProps<T> & { name: string };

const defaultRange = generateTimeRange('9:00', '17:00');

const TimeRangePicker = <T extends FieldValues>({
  label,
  error,
  ...props
}: TimeRangePickerProps<T>) => {
  const { field } = useController<T>({
    defaultValue: defaultRange as any,
    ...props,
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
