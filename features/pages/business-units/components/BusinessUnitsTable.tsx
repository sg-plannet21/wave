import ScheduleVersions from 'features/pages/schedules/components/ScheduleVersions';

const scheduleId = '9594dce5-ba32-413b-9430-39620f165f30';
const BusinessUnitsTable: React.FC = () => {
  return <ScheduleVersions scheduleId={scheduleId} />;
};

export default BusinessUnitsTable;
