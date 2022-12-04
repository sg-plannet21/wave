import Search from 'components/inputs/search';
import Pagination from 'components/navigation/Pagination';
import { paginate } from 'lib/client/paginate';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import Table, { SortColumn, TableProps } from '../table/Table';

export type WaveTableProps<Entry> = TableProps<Entry> & {
  pageSize?: number;
};

const WaveTable = <Entry extends { [P in keyof Entry]: Entry[P] }>({
  columns,
  data,
  sortColumn = { field: columns[0]?.field, order: 'asc' },
  pageSize = 5,
}: WaveTableProps<Entry>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCol, setSortCol] = useState<SortColumn<Entry>>(sortColumn);

  useEffect(() => {
    if (searchTerm.trim().length) setCurrentPage(1);
  }, [searchTerm]);

  const filterableFields = useMemo(
    () => columns.filter((column) => !column.ignoreFiltering),
    [columns]
  );

  const filteredData = useMemo(() => {
    if (!searchTerm.trim().length) return data;

    const regEx = new RegExp(searchTerm.trim(), 'i');
    const filtered = data.filter((entry) => {
      for (const prop of filterableFields)
        if (!prop.ignoreFiltering)
          if (regEx.test(entry[prop.field] as string)) return true;

      return false;
    });
    return filtered;
  }, [data, searchTerm, filterableFields]);

  const orderedData = useMemo(
    () => _.orderBy(filteredData, [sortCol.field], [sortCol.order]),
    [filteredData, sortCol]
  );

  const pagedData = useMemo(
    () => paginate(orderedData ?? [], currentPage, pageSize),
    [orderedData, currentPage, pageSize]
  );

  return (
    <>
      <div className="py-2 px-4 flex justify-end">
        <div className="w-72">
          <Search
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Table<Entry>
        columns={columns}
        data={pagedData}
        onSort={setSortCol}
        sortColumn={sortCol}
      />
      <div className="px-6">
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          itemCount={filteredData.length}
        />
      </div>
    </>
  );
};

export default WaveTable;
