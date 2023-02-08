import VersionsDrawer from 'features/entity-versions/components/VersionsDrawer';
import VersionsTable from 'features/entity-versions/components/VersionsTable';
import useScheduleVersionData from '../hooks/useScheduleVersionData';

type ScheduleVersionsProps = {
  scheduleId: string;
};

const ScheduleVersions: React.FC<ScheduleVersionsProps> = ({ scheduleId }) => {
  const { data, mappings, error, isLoading, label } =
    useScheduleVersionData(scheduleId);

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

export default ScheduleVersions;
