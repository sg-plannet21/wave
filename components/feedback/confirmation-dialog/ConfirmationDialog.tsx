import { Exclamation, Info } from 'components/icons';
import Button from 'components/inputs/button';
import React from 'react';
import { useDisclosure } from 'state/hooks/useDisclosure';
import Dialog, { DialogTitle } from '../dialog/Dialog';

export type ConfirmationDialogProps = {
  triggerButton: React.ReactElement;
  confirmButton: React.ReactElement;
  title: string;
  body?: string;
  cancelButtonText?: string;
  icon?: 'danger' | 'info';
  isDone?: boolean;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  triggerButton,
  confirmButton,
  title,
  body = '',
  cancelButtonText = 'Cancel',
  icon = 'danger',
  isDone = false,
}) => {
  const { isOpen, open, close } = useDisclosure();

  const cancelButtonRef = React.useRef(null);

  React.useEffect(() => {
    if (isDone) close();
  }, [isDone, close]);

  const triggerBtn = React.cloneElement(triggerButton, {
    onClick: open,
  });

  return (
    <>
      {triggerBtn}
      <Dialog isOpen={isOpen} onClose={close} initialFocus={cancelButtonRef}>
        <div className="sm:flex sm:items-start">
          {icon === 'danger' && (
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <Exclamation
                className="h-6 w-6 text-red-600"
                aria-hidden="true"
              />
            </div>
          )}

          {icon === 'info' && (
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <Info className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
          )}

          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <DialogTitle
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              {title}
            </DialogTitle>
            {body && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">{body}</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex space-x-2 justify-end">
          <Button
            type="button"
            variant="inverse"
            className="w-full inline-flex justify-center rounded-md border focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={close}
            ref={cancelButtonRef}
          >
            {cancelButtonText}
          </Button>
          {confirmButton}
        </div>
      </Dialog>
    </>
  );
};

export default ConfirmationDialog;
