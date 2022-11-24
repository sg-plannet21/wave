import { SelectProps } from './Select';

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
  { label: 'Option D', value: 'd' },
];

// TODO
const base: SelectProps = {
  options,
  selectedOption: options[2],
  onChange: () => {},
};

export const mockSelectProps = {
  base,
};
