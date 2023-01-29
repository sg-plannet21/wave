import CardSkeleton, { CardSkeletonProps } from '../card/CardSkeleton';
import WaveTableSkeleton, {
  WaveTableSkeletonProps,
} from '../wave-table/WaveTableSkeleton';

export type WaveTablePageProps = WaveTableSkeletonProps & {
  filters?: CardSkeletonProps[];
  numberOfButtons?: number;
  showPagination?: boolean;
};

const WaveTablePage: React.FC<WaveTablePageProps> = ({
  filters = [{}],
  numberOfColumns,
  numberOfRows,
  numberOfButtons = 1,
  showPagination = true,
}) => {
  const buttonArray = Array.from(Array(numberOfButtons).keys());
  return (
    <div className="flex flex-col md:flex-row">
      <div className="sm:w-56 flex md:flex-col p-2 space-x-3 md:space-y-3 md:space-x-0">
        {buttonArray.map((button) => (
          <div
            key={button}
            className="h-4 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5 sm:w-full"
          />
        ))}

        <div className="hidden space-y-0 md:flex md:flex-col md:space-y-4">
          {filters.map((filter, index) => (
            <CardSkeleton key={index} {...filter} />
          ))}
        </div>
      </div>
      {showPagination && (
        <div className="flex-1 overflow-x-auto">
          <WaveTableSkeleton
            numberOfColumns={numberOfColumns}
            numberOfRows={numberOfRows}
          />
        </div>
      )}
    </div>
  );
};

export default WaveTablePage;
