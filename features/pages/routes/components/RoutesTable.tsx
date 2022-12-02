import { TableColumn } from 'components/data-display/table';
import WaveTable from 'components/data-display/wave-table';
import Card from 'components/surfaces/card';
import { useRouteTableData } from '../hooks/useRoutesTableData';
import { RouteTableEntity } from '../types';

function generateColumns(): TableColumn<RouteTableEntity>[] {
  return [
    { field: 'route_name', label: 'Name' },
    { field: 'destination', label: 'Destination' },
    { field: 'destination_type_label', label: 'Destination Type' },
    {
      field: 'system_created_label',
      label: 'Type',
    },
  ];
}

const RoutesTable: React.FC = () => {
  const { data, error, isLoading } = useRouteTableData();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error has occurred..</div>;

  return (
    <div className="flex">
      <div className="hidden md:flex md:flex-col md:w-1/4">
        <Card title="System Filter" description="Enable system routes">
          filters go here
        </Card>
      </div>
      <div className="w-full">
        <WaveTable<RouteTableEntity> columns={generateColumns()} data={data} />
      </div>
    </div>
  );
};

export default RoutesTable;
