import { ComponentStory, Meta } from '@storybook/react';
import { TableProps } from '../table';
import WaveTable from './WaveTable';
import { mockWaveTableProps } from './WaveTable.mocks';

const meta: Meta = {
  title: 'datadisplay/WaveTable',
  component: WaveTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WaveTable> = (args) => (
  <WaveTable {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockWaveTableProps.base,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as TableProps<any>;
