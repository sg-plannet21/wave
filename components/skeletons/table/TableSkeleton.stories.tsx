import { ComponentStory, Meta } from '@storybook/react';
import TableSkeleton, { TableSkeletonProps } from './TableSkeleton';
import { mockTableSkeletonProps } from './TableSkeleton.mocks';

const meta: Meta = {
  title: 'skeletons/TableSkeleton',
  component: TableSkeleton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TableSkeleton> = (args) => (
  <TableSkeleton {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockTableSkeletonProps.base,
} as TableSkeletonProps;
