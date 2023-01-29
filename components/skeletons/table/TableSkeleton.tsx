import classNames from 'classnames';

export type TableSkeletonProps = {
  numberOfColumns?: number;
  numberOfRows?: number;
};

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  numberOfColumns = 4,
  numberOfRows = 8,
}) => {
  const columnArray = Array.from(Array(numberOfColumns).keys());
  const rowsArray = Array.from(Array(numberOfRows).keys());

  return (
    <div role="status" className="flex flex-col">
      <div className="my-2 overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 dark:border-slate-500 shadow sm:rounded-lg">
            <table className="min-w-full divide-y-2 divide-indigo-500 dark:divide-orange-400 text-gray-500 dark:text-gray-400">
              <thead className="text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {columnArray.map((col) => (
                    <th key={`th${col}`} className="px-6 py-3">
                      <div
                        className={classNames(
                          'h-2.5 bg-gray-100 rounded-full dark:bg-gray-600 animate-pulse',
                          { 'w-24': col % 2 !== 0 },
                          { 'w-32': col % 2 === 0 }
                        )}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowsArray.map((row) => (
                  <tr
                    key={row}
                    className="odd:bg-white odd:dark:bg-slate-800 even:bg-gray-200 even:dark:bg-gray-700"
                  >
                    {columnArray.map((col) => (
                      <td key={`${row}${col}`} className="px-6 py-4">
                        <div
                          className={classNames(
                            'h-2 bg-gray-100 rounded-full dark:bg-gray-600 animate-pulse',
                            { 'w-1/2': row % 2 !== 0 },
                            { 'w-3/4': row % 2 === 0 }
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
