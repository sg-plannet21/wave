import { ComponentStory, Meta, Story } from '@storybook/react';
import React from 'react';
import { useDisclosure } from '../../../state/hooks/useDisclosure';
import Button from '../../buttons/Button';
import Dialog, { DialogTitle } from './Dialog';

import { mockDialogProps } from './Dialog.mocks';

const meta: Meta = {
  title: 'feedback/Dialog',
  component: Dialog,
  parameters: {
    controls: { expanded: true },
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Dialog> = (args) => <Dialog {...args} />;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockDialogProps.base,
};

export const Demo: Story = () => {
  const { close, open, isOpen } = useDisclosure();
  const cancelButtonRef = React.useRef(null);

  return (
    <>
      <Button onClick={open}>Open Modal</Button>
      <Dialog isOpen={isOpen} onClose={close} initialFocus={cancelButtonRef}>
        <DialogTitle
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          Payment successful
        </DialogTitle>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Your payment has been successfully submitted. We’ve sent you an
            email with all of the details of your order.
          </p>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={close}
          >
            Got it, thanks!
          </button>
        </div>
      </Dialog>
    </>
  );
};
