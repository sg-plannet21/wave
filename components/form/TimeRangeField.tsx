import {
  TimeRangePickerProps as AntDTimeRangePickerProps,
  TimePicker,
} from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import getConfig from 'next/config';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

const {
  publicRuntimeConfig: { timeFormat },
} = getConfig();

type TimeRangePickerProps = AntDTimeRangePickerProps &
  FieldWrapperPassThroughProps;

const TimeRangePicker = ({ label, error, ...props }: TimeRangePickerProps) => {
  return (
    <FieldWrapper label={label} error={error}>
      <TimePicker.RangePicker
        format={timeFormat}
        allowClear={false}
        minuteStep={15}
        className="w-full"
        placement="bottomLeft"
        {...props}
      />
    </FieldWrapper>
  );
};

export default TimeRangePicker;
