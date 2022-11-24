import classNames from 'classnames';
import { Archive, DoubleChevron } from 'components/icons';

export type SortColumn<Entry> = {
  field: keyof Entry;
  order: 'asc' | 'desc';
};

export type TableColumn<Entry> = {
  title: string;
  field: keyof Entry;
  ignoreFiltering?: boolean;
  Cell?({ entry }: { entry: Entry }): React.ReactElement;
};

export type TableProps<Entry> = {
  data: Entry[];
  columns: TableColumn<Entry>[];
  sortColumn?: SortColumn<Entry>;
  onSort?: (sortColumn: SortColumn<Entry>) => void;
};

const Table = <Entry extends { id: string }>({
  data,
  columns,
  sortColumn = {
    field: columns[0]?.field,
    order: 'asc',
  },
  onSort,
}: TableProps<Entry>) => {
  function raiseSort(field: keyof Entry) {
    console.log('changing order of', field);
    if (!onSort) return;
    const updatedSortColumn = { ...sortColumn };
    if (updatedSortColumn?.field === field) {
      updatedSortColumn.order =
        updatedSortColumn.order === 'asc' ? 'desc' : 'asc';
    } else {
      updatedSortColumn.field = field;
      updatedSortColumn.order = 'asc';
    }
    onSort(updatedSortColumn);
  }

  function renderSortIcon(field: keyof Entry) {
    if (sortColumn?.field === field) {
      return sortColumn.order === 'asc' ? (
        <ChevronUp className="shrink-0 w-6 h-6" />
      ) : (
        <ChevronDown className="shrink-0 w-6 h-6" />
      );
    }
    return <DoubleChevron className="shrink-0 w-6 h-6" />;
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-500 bg-white h-80">
        <Archive className="w-16 h-16" />
        <h4>No Entries Found</h4>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, index) => {
                    const isFilterable = !!onSort && !column.ignoreFiltering;
                    return (
                      <th
                        key={column.title + index}
                        scope="col"
                        {...(isFilterable && {
                          onClick: () => raiseSort(column.field),
                        })}
                        className={classNames(
                          'px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase',
                          {
                            'cursor-pointer': isFilterable,
                          }
                        )}
                      >
                        <div className="flex items-center space-x-1">
                          {column.title}
                          {isFilterable && renderSortIcon(column.field)}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {data.map((entry, entryIndex) => (
                  <tr
                    key={entry?.id || entryIndex}
                    className="odd:bg-white even:bg-gray-100"
                  >
                    {columns.map(({ Cell, field, title }, columnIndex) => (
                      <td
                        key={title + columnIndex}
                        className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
                      >
                        {Cell ? (
                          <Cell entry={entry} />
                        ) : (
                          (entry[field] as string | number)
                        )}
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

export default Table;

function ChevronDown({ ...props }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16 8.90482M8 15.0952L12 20L16 15.0952"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronUp({ ...props }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16 8.90482L12 4L8 8.90482M8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
