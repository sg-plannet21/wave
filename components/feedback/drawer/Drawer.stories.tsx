import { ComponentStory, Meta, Story } from '@storybook/react';
import Button from 'components/inputs/Button';
import { useDisclosure } from 'state/hooks/useDisclosure';
import Drawer, { DrawerProps } from './Drawer';
import { mockDrawerProps } from './Drawer.mocks';

const meta: Meta = {
  title: 'feedback/Drawer',
  component: Drawer,
  parameters: {
    controls: { expanded: true },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Drawer> = (args) => <Drawer {...args} />;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockDrawerProps.base,
} as DrawerProps;

export const Demo: Story = () => {
  const { close, open, isOpen } = useDisclosure();

  return (
    <>
      <Button onClick={open}>Open Drawer</Button>
      <Drawer
        isOpen={isOpen}
        onClose={close}
        title="Sample Drawer"
        size="md"
        renderFooter={() => (
          <Button
            type="button"
            variant="inverse"
            size="sm"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={close}
          >
            Got it, thanks!
          </Button>
        )}
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Your payment has been successfully submitted. We’ve sent you an
            email with all of the details of your order.
          </p>
        </div>
      </Drawer>
    </>
  );
};
