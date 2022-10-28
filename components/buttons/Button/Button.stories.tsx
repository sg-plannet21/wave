import { ComponentMeta, ComponentStory } from '@storybook/react';
import Button, { ButtonProps } from './Button';
import { mockButtonProps } from './Button.mocks';

export default {
  title: 'buttons/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockButtonProps.base,
} as ButtonProps;
