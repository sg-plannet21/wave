import { Meta, Story } from '@storybook/react';
import { User } from 'state/auth/types';
import BusinessUnitSelect from '.';

const businessUnits: User['business_unit_roles'] = [
  {
    business_unit: '1',
    business_unit_name: 'Business Unit 1',
    default_region: 1,
    roles: [],
  },
  {
    business_unit: '2',
    business_unit_name: 'Business Unit 2',
    default_region: 2,
    roles: [],
  },
];

const BusinessUnitSelectExample: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-4 bg-slate-800 text-white min-h-screen">
      <h1 className="text-center font-bold text-2xl text-emerald-700">
        Select Example
      </h1>
      <div className="w-60">
        <BusinessUnitSelect businessUnits={businessUnits} />
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'navigation/BusinessUnitSelect',
  component: BusinessUnitSelectExample,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = () => <BusinessUnitSelectExample />;

export const Default = Template.bind({});
Default.args = {};
