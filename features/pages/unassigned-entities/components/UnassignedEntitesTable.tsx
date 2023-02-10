import Table, { TableColumn } from 'components/data-display/table';
import Button from 'components/inputs/button';

export type EntityTableRecord = {
  id: string;
  name: string;
  businessUnit: string;
  onAssign: (id: string) => void;
};

const columns: TableColumn<EntityTableRecord>[] = [
  { field: 'name', label: 'Name' },
  { field: 'businessUnit', label: 'Destination Business Unit' },
  {
    field: 'id',
    label: '',
    Cell({ entry }: { entry: EntityTableRecord }) {
      return (
        <Button
          className="ml-auto mr-0"
          size="sm"
          onClick={() => entry.onAssign(entry.id)}
        >
          Assign
        </Button>
      );
    },
  },
];

const UnassignedEntitiesTable: React.FC<{ data: EntityTableRecord[] }> = ({
  data,
}) => {
  return <Table<EntityTableRecord> columns={columns} data={data} />;
};

export default UnassignedEntitiesTable;
