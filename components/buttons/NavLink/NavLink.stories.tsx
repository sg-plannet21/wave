import { ComponentMeta, ComponentStory } from '@storybook/react';
import NavLink, { INavLink } from './NavLink';
import { mockNavLinkProps } from './NavLink.mocks';

export default {
  title: 'buttons/NavLink',
  component: NavLink,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof NavLink>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NavLink> = (args) => (
  <NavLink {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockNavLinkProps.base,
} as INavLink;
