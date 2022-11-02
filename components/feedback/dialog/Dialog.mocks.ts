const base = {
  isOpen: true,
  onClose: () => {
    console.log('close');
  },
  children: 'Content',
};

export const mockDialogProps = {
  base,
};
