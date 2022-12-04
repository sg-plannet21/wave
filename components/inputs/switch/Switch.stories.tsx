import { ComponentStory, Meta } from '@storybook/react';
import Switch, { SwitchProps } from './Switch';
import { mockSwitchProps } from './Switch.mocks';

const meta: Meta = {
  title: 'templates/Switch',
  component: Switch,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockSwitchProps.base,
} as SwitchProps;
