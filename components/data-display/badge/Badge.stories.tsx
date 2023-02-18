import { ComponentStory, Meta } from '@storybook/react';
import Badge, { BadgeProps } from './Badge';
import { mockBadgeProps } from './Badge.mocks';

const meta: Meta = {
  title: 'datadisplay/Badge',
  component: Badge,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockBadgeProps.base,
} as BadgeProps;
