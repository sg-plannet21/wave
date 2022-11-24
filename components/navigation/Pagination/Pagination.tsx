import classNames from 'classnames';
import _ from 'lodash';
import React, { useMemo } from 'react';

export type PaginationProps = {
  currentPage: number;
  pageSize: number;
  itemCount: number;
  onPageChange: (currentPage: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize = 1,
  itemCount = 1,
  onPageChange,
}) => {
  const pageCount = Math.ceil(itemCount / pageSize);

  const pages: number[] = useMemo(() => {
    // return [1 ... pageCount] when page count is 10 or less
    if (pageCount <= 10) return _.range(1, pageCount + 1);

    function isValidPageNumber(pageNum: number): boolean {
      return pageNum > 0 && pageNum < pageCount;
    }

    // first page
    const activePages = [1];

    // page at 25%, 50%, 75% & 100% of pageCount
    for (let i = 0.25; i <= 1; i += 0.25) {
      const newPage = Math.floor(i * pageCount);
      activePages.push(newPage);
    }

    // page at currentPage & 2 pages either side
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (isValidPageNumber(i)) activePages.push(i);
    }

    // remove duplicates & sort page array
    const sortedPages = _.chain(activePages).sortBy().uniq().value();

    return sortedPages;
  }, [currentPage, pageCount]);

  function renderCaption() {
    const startItemIndex = (currentPage - 1) * pageSize + 1;
    const endItemIndex =
      currentPage * pageSize > itemCount ? itemCount : currentPage * pageSize;

    return (
      <span className="text-sm text-gray-700 dark:text-gray-400">
        Showing{' '}
        <span className="font-semibold text-gray-900 dark:text-white">
          {startItemIndex}
        </span>{' '}
        {startItemIndex !== endItemIndex && (
          <>
            to{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {endItemIndex}
            </span>{' '}
          </>
        )}
        of{' '}
        <span className="font-semibold text-gray-900 dark:text-white">
          {itemCount}
        </span>{' '}
        entries
      </span>
    );
  }

  function renderPageNavigation() {
    return (
      <nav aria-label="Page navigation">
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <a
              href="#"
              {...(currentPage > 1 && {
                onClick: () => onPageChange(currentPage - 1),
              })}
              className={classNames(
                'block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
                { 'cursor-not-allowed': currentPage === 1 }
              )}
            >
              <span className="sr-only">Previous</span>
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </li>
          {pages.map((page) => (
            <li key={page}>
              <a
                onClick={() => onPageChange(page)}
                href="#"
                {...(currentPage && { 'aria-current': 'page' })}
                className={classNames(
                  'py-2 px-3 leading-tight border',
                  {
                    'text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white':
                      currentPage === page,
                  },
                  {
                    'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white':
                      currentPage !== page,
                  }
                )}
              >
                {page}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#"
              {...(currentPage < pageCount && {
                onClick: () => onPageChange(currentPage + 1),
              })}
              className={classNames(
                'block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
                { 'cursor-not-allowed': currentPage === pageCount }
              )}
            >
              <span className="sr-only">Next</span>
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    );
  }

  if (itemCount === 0 || pageSize === 0) return null;

  return (
    <div className="flex justify-between items-center">
      {renderCaption()}
      {pageCount > 1 && renderPageNavigation()}
    </div>
  );
};

export default Pagination;
