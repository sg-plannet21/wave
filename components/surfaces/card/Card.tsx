type HeadlessProps = {
  title?: never;
  description?: never;
};

type WithTitleProps = {
  title: string;
  description?: string;
};

type TitleProps = HeadlessProps | WithTitleProps;

export type CardProps = TitleProps & {
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, description, children }) => {
  return (
    <div className="p-3 max-w-sm bg-white rounded-lg border text-gray-900 dark:text-white border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <h5 className="mb-1 font-semibold tracking-tight">{title}</h5>
      {description && (
        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      <div className="mt-1 flex flex-col space-y-2">{children}</div>
    </div>
  );
};

export default Card;
