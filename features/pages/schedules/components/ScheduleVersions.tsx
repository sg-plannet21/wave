import VersionsTable from 'features/entity-versions/components/VersionsTable';
import useScheduleVersionData from '../hooks/useScheduleVersionData';

type ScheduleVersionsProps = {
  scheduleId: string;
};

const ScheduleVersions: React.FC<ScheduleVersionsProps> = ({ scheduleId }) => {
  const { data, mappings, error, isLoading } =
    useScheduleVersionData(scheduleId);

  if (error) return <div>We encountered an error...</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <VersionsTable
        mappings={mappings}
        currentVersion={data[0]}
        previousVersions={data.slice(1)}
      />
    </div>
  );
};

export default ScheduleVersions;
