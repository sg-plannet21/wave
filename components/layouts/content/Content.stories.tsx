import { ComponentMeta, ComponentStory } from '@storybook/react';
import ContentLayout, { IContentLayout } from './Content';
import { mockContentLayoutProps } from './Content.mocks';

export default {
  title: 'layouts/ContentLayout',
  component: ContentLayout,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof ContentLayout>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ContentLayout> = (args) => (
  <ContentLayout {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockContentLayoutProps.base,
} as IContentLayout;
