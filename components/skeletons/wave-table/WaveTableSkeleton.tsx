import TableSkeleton, { TableSkeletonProps } from '../table';

export type WaveTableSkeletonProps = TableSkeletonProps;

const WaveTableSkeleton: React.FC<WaveTableSkeletonProps> = ({
  numberOfColumns,
  numberOfRows,
}) => {
  return (
    <div className="flex flex-col">
      <div className="py-2 px-4 flex justify-end">
        <div className="w-72">
          <div className="h-2.5 bg-gray-100 rounded-full dark:bg-gray-600 animate-pulse" />
        </div>
      </div>
      <TableSkeleton
        numberOfColumns={numberOfColumns}
        numberOfRows={numberOfRows}
      />
      <div className="py-2 px-4 flex justify-between items-center">
        <div className="w-1/5 h-2.5 bg-gray-100 rounded-full dark:bg-gray-600 animate-pulse" />
        <div className="w-2/3 h-3.5 bg-gray-100 rounded-full dark:bg-gray-600 animate-pulse md:w-1/2" />
      </div>
    </div>
  );
};

export default WaveTableSkeleton;
