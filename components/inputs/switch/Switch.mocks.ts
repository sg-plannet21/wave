import { SwitchProps } from './Switch';

const base: SwitchProps = {
  isChecked: true,
  label: 'Test',
  onChange: () => {
    console.log('onChange');
  },
};

export const mockSwitchProps = {
  base,
};
