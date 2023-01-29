export type CardSkeletonProps = {
  showTitle?: boolean;
  showDescription?: boolean;
  rowCount?: number;
};

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showTitle = true,
  showDescription = true,
  rowCount = 3,
}) => {
  const rowsArray = Array.from(Array(rowCount).keys());

  return (
    <div className="flex justify-center">
      <div className="flex flex-col space-y-7 w-full max-w-sm p-6 rounded-lg shadow-md border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
        {showTitle && (
          <div className="h-3 w-2/3 bg-gray-100 rounded-full dark:bg-gray-700 animate-pulse" />
        )}
        {showDescription && (
          <div className="h-2.5 mt-3 w-4/5 bg-gray-100 rounded-full dark:bg-gray-600 animate-pulse" />
        )}

        <div className="mt-3 flex flex-col space-y-4">
          {rowsArray.map((row) => (
            <div
              key={row}
              className="h-2.5 bg-gray-100 rounded-full dark:bg-gray-600 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
