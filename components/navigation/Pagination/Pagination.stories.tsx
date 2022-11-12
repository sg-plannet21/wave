import { ComponentStory, Meta } from '@storybook/react';
import Pagination, { PaginationProps } from './Pagination';
import { mockPaginationProps } from './Pagination.mocks';

const meta: Meta = {
  title: 'templates/Pagination',
  component: Pagination,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Pagination> = (args) => (
  <Pagination {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockPaginationProps.base,
} as PaginationProps;
