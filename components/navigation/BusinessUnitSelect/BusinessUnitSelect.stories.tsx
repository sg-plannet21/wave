import { ComponentStory, Meta } from '@storybook/react';
import BusinessUnitDropdown, {
  BusinessUnitSelectProps,
} from './BusinessUnitSelect';
import { mockBusinessUnitSelectProps } from './BusinessUnitSelect.mocks';

const meta: Meta = {
  title: 'navigation/BusinessUnitDropdown',
  component: BusinessUnitDropdown,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BusinessUnitDropdown> = (args) => (
  <BusinessUnitDropdown {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockBusinessUnitSelectProps.base,
} as BusinessUnitSelectProps;
