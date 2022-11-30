import { Meta, Story } from '@storybook/react';

import AudioPlayerDialog, {
  AudioPlayerDialogProps,
} from 'components/feedback/audio-player-dialog';

const meta: Meta = {
  title: 'feedback/AudioPlayerDialog',
  component: AudioPlayerDialog,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<AudioPlayerDialogProps> = (props) => (
  <AudioPlayerDialog {...props} />
);

export const Example = Template.bind({});
Example.args = {
  trackList: { src: '/welcome.m4a', name: 'Welcome' },
};

// export const Danger = Template.bind({});
// Danger.args = {
//   icon: 'danger',
//   title: 'Confirmation',
//   body: 'Hello World',
//   confirmButton: <Button className="bg-red-500">Confirm</Button>,
//   triggerButton: <Button>Open</Button>,
// };

// export const Info = Template.bind({});
// Info.args = {
//   icon: 'info',
//   title: 'Confirmation',
//   body: 'Hello World',
//   confirmButton: <Button>Confirm</Button>,
//   triggerButton: <Button>Open</Button>,
// };
