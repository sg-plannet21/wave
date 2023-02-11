export type PopoverProps = {
  message: string;
  children: React.ReactNode;
};

const Popover: React.FC<PopoverProps> = ({ message, children }) => {
  return (
    <div className="group relative inline-flex">
      {children}
      <span className="absolute bottom-7 scale-0 transition-all rounded bg-white dark:bg-gray-800 p-2 text-xs text-gray-500 shadow-sm border border-gray-200 dark:border-gray-600 dark:text-white group-hover:scale-100 whitespace-nowrap">
        {message}
      </span>
    </div>
  );
};

export default Popover;
