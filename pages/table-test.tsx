import Table, { SortColumn, TableColumn } from 'components/data-display/table/';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import _ from 'lodash';
import { useState } from 'react';
import { NextPageWithLayout } from './page';

type Dessert = {
  id: string;
  name: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
};

const desserts: Dessert[] = [
  {
    id: '1',
    name: 'Frozen yoghurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    id: '2',
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
  },
  { id: '3', name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6 },
  { id: '4', name: 'Cupcake', calories: 305, fat: 3, carbs: 67, protein: 4.3 },
  {
    id: '5',
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
  },
];

const columns: TableColumn<Dessert>[] = [
  {
    field: 'name',
    label: 'Dessert (100g serving)',
  },
  {
    field: 'calories',
    label: 'Calories',
  },
  { field: 'fat', label: 'Fat (g)' },
  { field: 'carbs', label: 'Carbs (g)' },
  { field: 'protein', label: 'Protein (g)', ignoreFiltering: true },
];

const TableTest: NextPageWithLayout = () => {
  const [sortColumn, setSortColumn] = useState<SortColumn<Dessert>>({
    field: 'name',
    order: 'asc',
  });
  function filterData(data: Dessert[]): Dessert[] {
    return _.orderBy(data, sortColumn.field, sortColumn.order);
  }
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl text-purple-700 leading-5 text-center">
        Example Form
      </h1>
      <Table<Dessert>
        data={filterData(desserts)}
        columns={columns}
        onSort={setSortColumn}
        sortColumn={sortColumn}
      />
    </div>
  );
};

export default TableTest;

TableTest.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
