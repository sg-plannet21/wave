import { ComponentStory, Meta } from '@storybook/react';
import Popover, { PopoverProps } from './Popover';
import { mockPopoverProps } from './Popover.mocks';

const meta: Meta = {
  title: 'data-display/Popover',
  component: Popover,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Popover> = (args) => (
  <Popover {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockPopoverProps.base,
} as PopoverProps;
