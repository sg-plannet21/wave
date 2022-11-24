import { Meta, Story } from '@storybook/react';
import { useState } from 'react';
import Select, { SelectOption } from './Select';

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
  { label: 'Option D', value: 'd' },
];

const SelectExample: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<SelectOption>(
    options[2]
  );

  return (
    <div className="flex flex-col items-center p-4 bg-slate-800 text-white min-h-screen">
      <h1 className="text-center font-bold text-2xl text-emerald-700">
        Select Example
      </h1>
      <div className="w-60">
        <Select
          options={options}
          selectedOption={selectedOption}
          onChange={setSelectedOption}
        />
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'inputs/Select',
  component: SelectExample,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = () => <SelectExample />;

export const Default = Template.bind({});
Default.args = {};
