import { TableColumn, TableProps } from '../table';

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
  { field: 'protein', label: 'Protein (g)' },
];

const base: TableProps<Dessert> = {
  data: desserts,
  columns: columns,
  sortColumn: {
    field: 'name',
    order: 'asc',
  },
  onSort: undefined,
  // onSort(sortColumn) {
  //   console.log('Sorting', sortColumn);
  // },
};

export const mockWaveTableProps = {
  base,
};
