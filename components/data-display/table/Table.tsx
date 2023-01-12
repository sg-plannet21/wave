import classNames from 'classnames';
import { Archive, DoubleChevron } from 'components/icons';

export type SortColumn<Entry> = {
  field: keyof Entry;
  order: 'asc' | 'desc';
};

export type TableColumn<Entry> = {
  field: keyof Entry;
  label: string;
  Cell?: ({ entry }: { entry: Entry }) => JSX.Element;
  ignoreFiltering?: boolean;
};

export type TableProps<Entry> = {
  data: Entry[];
  columns: TableColumn<Entry>[];
  sortColumn?: SortColumn<Entry>;
  onSort?: (sortColumn: SortColumn<Entry>) => void;
};

const Table = <Entry extends { [P in keyof Entry]: Entry[P] }>({
  data,
  columns,
  sortColumn = {
    field: columns[0]?.field,
    order: 'asc',
  },
  onSort,
}: TableProps<Entry>) => {
  function raiseSort(field: keyof Entry) {
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
        <ChevronUp className="shrink-0 w-6 h-6 text-indigo-500 dark:text-orange-400" />
      ) : (
        <ChevronDown className="shrink-0 w-6 h-6 text-indigo-500 dark:text-orange-400" />
      );
    }
    return <DoubleChevron className="shrink-0 w-6 h-6" />;
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-white h-80">
        <Archive className="w-16 h-16" />
        <h4 className="dark:text-white">No Entries Found</h4>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="rounded-lg inline-block min-w-full align-middle overflow-x-auto py-2 sm:px-4 lg:px-6">
        <table className="min-w-full divide-y-2 divide-indigo-500 dark:divide-orange-400 text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((column, index) => {
                const isFilterable = !!onSort && !column.ignoreFiltering;
                return (
                  <th
                    key={column.label + index}
                    scope="col"
                    {...(isFilterable && {
                      onClick: () => raiseSort(column.field),
                    })}
                    className={classNames(
                      'px-6 py-3 font-medium tracking-wider text-left',
                      {
                        'cursor-pointer': isFilterable,
                      }
                    )}
                  >
                    <div className="flex items-center space-x-1">
                      {column.label}
                      {isFilterable && renderSortIcon(column.field)}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((record, entryIndex) => (
              <tr
                key={entryIndex}
                className="odd:bg-white odd:dark:bg-slate-800 even:bg-gray-200 even:dark:bg-gray-700"
              >
                {columns.map(({ field, label, Cell }, index) => (
                  <td
                    key={label + entryIndex + index}
                    className="px-6 py-4 text-sm font-medium whitespace-nowrap"
                  >
                    {Cell ? (
                      <Cell entry={record} />
                    ) : (
                      (record[field] as string | number)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
        d="M16 8.90482L12 4L8 8.90482M8 15.0952"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
