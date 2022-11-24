import { BusinessUnitSelectProps } from './BusinessUnitSelect';

const businessUnitList = [
  { path: 'bu1', label: 'Business Unit 1' },
  { path: 'bu2', label: 'Business Unit 2' },
  { path: 'bu3', label: 'Business Unit 3' },
  { path: 'bu4', label: 'Business Unit 4' },
];

const base: BusinessUnitSelectProps = {
  businessUnits: businessUnitList,
};

export const mockBusinessUnitSelectProps = {
  base,
};
