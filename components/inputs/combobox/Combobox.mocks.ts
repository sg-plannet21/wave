import { ComboboxProps } from './Combobox';

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
  { label: 'Option D', value: 'd' },
];

const base: ComboboxProps = {
  options,
  selectedOption: options[1],
  onChange: () => {
    console.log('onChange');
  },
};

export const mockBaseTemplateProps = {
  base,
};
