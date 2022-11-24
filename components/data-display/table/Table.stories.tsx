import { ComponentStory, Meta } from '@storybook/react';
import Table, { TableProps } from './Table';
import { mockTableProps } from './Table.mocks';

const meta: Meta = {
  title: 'datadisplay/Table',
  component: Table,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockTableProps.base,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as TableProps<any>;
