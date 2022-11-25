import { ComponentStory, Meta } from '@storybook/react';
import AudioPlayer, { AudioPlayerProps } from './AudioPlayer';
import { mockAudioPlayerProps } from './AudioPlayer.mocks';

const meta: Meta = {
  title: 'templates/AudioPlayer',
  component: AudioPlayer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AudioPlayer> = (args) => (
  <AudioPlayer {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockAudioPlayerProps.base,
} as AudioPlayerProps;
