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
    <div className="flex justify-center">
      <div className="block max-w-sm p-6 rounded-lg shadow-md border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 ">
        <h5 className="text-gray-900 dark:text-gray-200 text-lg leading-tight font-medium mb-2">
          {title}
        </h5>
        {description && (
          <p className="text-gray-700 text-base dark:text-gray-400">
            {description}
          </p>
        )}
        <div className="mt-2 flex flex-col space-y-2">{children}</div>
      </div>
    </div>
  );
};

export default Card;
