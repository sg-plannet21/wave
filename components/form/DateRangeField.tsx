import { DatePicker, TimeRangePickerProps } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import moment from 'moment';
import getConfig from 'next/config';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

const {
  publicRuntimeConfig: { dateFormat },
} = getConfig();

type DateRangePickerProps = TimeRangePickerProps & FieldWrapperPassThroughProps;

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  label,
  error,
  ...props
}) => {
  return (
    <FieldWrapper label={label} error={error}>
      <DatePicker.RangePicker
        format={dateFormat}
        allowClear={false}
        className="w-full"
        minuteStep={15}
        placement="bottomLeft"
        showTime={true}
        disabledDate={(current) => current?.isBefore(moment().startOf('day'))}
        {...props}
      />
    </FieldWrapper>
  );
};

export default DateRangePicker;
