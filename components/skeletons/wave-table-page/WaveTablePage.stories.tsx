import { ComponentStory, Meta } from '@storybook/react';
import WaveTablePage, { WaveTablePageProps } from './WaveTablePage';
import { mockWaveTablePageProps } from './WaveTablePage.mocks';

const meta: Meta = {
  title: 'templates/WaveTablePage',
  component: WaveTablePage,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WaveTablePage> = (args) => (
  <WaveTablePage {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockWaveTablePageProps.base,
} as WaveTablePageProps;
