import { TableColumn } from 'components/data-display/table';
import WaveTable from 'components/data-display/wave-table';
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
      <div className="hidden md:flex col w-1/4">Filters</div>
      <WaveTable<RouteTableEntity> columns={generateColumns()} data={data} />
    </div>
  );
};

export default RoutesTable;
