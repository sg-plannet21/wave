import React from 'react';
import Button from '../components/buttons/Button';
import Dialog, { DialogTitle } from '../components/feedback/dialog/Dialog';

import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import { useDisclosure } from '../state/hooks/useDisclosure';

import { NextPageWithLayout } from './page';

const Test: NextPageWithLayout = () => {
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

export default Test;

Test.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
