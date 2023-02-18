import VersionsDrawer from 'features/entity-versions/components/VersionsDrawer';
import VersionsTable from 'features/entity-versions/components/VersionsTable';
import useScheduleExceptionsVersionData from '../hooks/useScheduleExceptionsVersionData';

type ScheduleExceptionVersionsProps = {
  scheduleExceptionId: string;
};

const ScheduleExceptionVersions: React.FC<ScheduleExceptionVersionsProps> = ({
  scheduleExceptionId: scheduleId,
}) => {
  const { data, mappings, error, isLoading, label } =
    useScheduleExceptionsVersionData(scheduleId);

  if (error) return <div>We encountered an error...</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <VersionsDrawer title={label}>
      <VersionsTable
        mappings={mappings}
        currentVersion={data[0]}
        previousVersions={data.slice(1)}
      />
    </VersionsDrawer>
  );
};

export default ScheduleExceptionVersions;
