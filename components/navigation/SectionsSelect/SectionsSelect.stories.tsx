import { Meta, Story } from '@storybook/react';
import SectionsSelect from '.';

const SectionsSelectExample: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-4 bg-slate-800 text-white min-h-screen">
      <h1 className="text-center font-bold text-2xl text-emerald-700">
        Sections Select Example
      </h1>
      <div className="w-60">
        <SectionsSelect />
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'navigation/SectionsSelect',
  component: SectionsSelectExample,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = () => <SectionsSelectExample />;

export const Default = Template.bind({});
Default.args = {};
