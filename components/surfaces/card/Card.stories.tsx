import { ComponentStory, Meta } from '@storybook/react';
import Card, { CardProps } from './Card';
import { mockCardProps } from './Card.mocks';

const meta: Meta = {
  title: 'surfaces/Card',
  component: Card,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCardProps.base,
} as CardProps;
