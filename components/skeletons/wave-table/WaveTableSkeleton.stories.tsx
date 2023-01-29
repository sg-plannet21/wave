import { ComponentStory, Meta } from '@storybook/react';
import WaveTableSkeleton, { WaveTableSkeletonProps } from './WaveTableSkeleton';
import { mockWaveTableSkeletonProps } from './WaveTableSkeleton.mocks';

const meta: Meta = {
  title: 'skeletons/WaveTableSkeleton',
  component: WaveTableSkeleton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WaveTableSkeleton> = (args) => (
  <WaveTableSkeleton {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockWaveTableSkeletonProps.base,
} as WaveTableSkeletonProps;
