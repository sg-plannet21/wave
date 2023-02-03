import Drawer from 'components/feedback/drawer';
import { History } from 'components/icons';
import Button from 'components/inputs/button/Button';
import React from 'react';
import { useDisclosure } from 'state/hooks/useDisclosure';

export type VersionsDrawerProps = {
  title: string;
  children: React.ReactNode;
  triggerButton?: React.ReactElement;
};

const VersionsDrawer: React.FC<VersionsDrawerProps> = ({
  title,
  children,
  triggerButton = (
    <button className="text-emerald-600 dark:text-emerald-400 transition-transform hover:scale-110">
      <History className="w-5 h-5" />
    </button>
  ),
}) => {
  const { open, close, isOpen } = useDisclosure();
  const triggerBtn = React.cloneElement(triggerButton, { onClick: open });
  return (
    <>
      {triggerBtn}
      <Drawer
        title={title}
        isOpen={isOpen}
        onClose={close}
        size="lg"
        renderFooter={() => (
          <Button onClick={close} variant="inverse" size="sm">
            Close
          </Button>
        )}
      >
        {children}
      </Drawer>
    </>
  );
};

export default VersionsDrawer;
