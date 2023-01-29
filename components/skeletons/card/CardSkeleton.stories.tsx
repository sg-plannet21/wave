import { ComponentStory, Meta } from '@storybook/react';
import CardSkeleton, { CardSkeletonProps } from './CardSkeleton';
import { mockCardSkeletonProps } from './CardSkeleton.mocks';

const meta: Meta = {
  title: 'skeletons/CardSkeleton',
  component: CardSkeleton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CardSkeleton> = (args) => (
  <CardSkeleton {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockCardSkeletonProps.base,
} as CardSkeletonProps;
