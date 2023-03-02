import VersionsDrawer from 'features/entity-versions/components/VersionsDrawer';
import VersionsTable from 'features/entity-versions/components/VersionsTable';
import useQueuesVersionData from '../hooks/useQueueVersionsData';

type QueueVersionsProps = {
  queueId: string;
};

const QueueVersions: React.FC<QueueVersionsProps> = ({ queueId: queueId }) => {
  const { data, mappings, error, isLoading, label } =
    useQueuesVersionData(queueId);

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

export default QueueVersions;
