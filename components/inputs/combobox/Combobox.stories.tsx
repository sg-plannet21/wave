import { ComponentStory, Meta } from '@storybook/react';
import Combobox, { ComboboxProps } from './Combobox';
import { mockBaseTemplateProps } from './Combobox.mocks';

const meta: Meta = {
  title: 'inputs/Combobox',
  component: Combobox,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Combobox> = (args) => (
  <Combobox {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockBaseTemplateProps.base,
} as ComboboxProps;
