import { Meta, Story } from '@storybook/react';
import { useState } from 'react';
import Search from './Search';

const SearchExample = () => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="dark:bg-slate-800 dark:text-white h-screen w-full p-4">
      <div className="w-full md:w-96">
        <Search
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'inputs/Search',
  component: SearchExample,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = () => <SearchExample />;

export const Default = Template.bind({});
Default.args = {};
