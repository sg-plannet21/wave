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
      <nav
        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        <a
          href="#"
          {...(currentPage > 1 && {
            onClick: () => onPageChange(currentPage - 1),
          })}
          className={classNames(
            'relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 focus:z-20',
            'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400',
            {
              'cursor-default': currentPage === 1,
            },
            {
              'hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:text-white':
                currentPage !== 1,
            }
          )}
        >
          <span className="sr-only">Previous</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        {pages.map((page, index, arr) => (
          <React.Fragment key={page}>
            {index > 0 && arr[index] - 1 > arr[index - 1] && (
              <span
                className={classNames(
                  'relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700',
                  'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400'
                )}
              >
                ...
              </span>
            )}
            <a
              onClick={() => onPageChange(page)}
              href="#"
              {...(currentPage && { 'aria-current': 'page' })}
              className={classNames(
                'relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20 bg-white',
                'dark:bg-gray-800 dark:border-gray-600',
                {
                  'z-10 border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-gray-600 dark:text-white':
                    currentPage === page,
                },
                {
                  'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400':
                    currentPage !== page,
                }
              )}
            >
              {page}
            </a>
          </React.Fragment>
        ))}
        <a
          href="#"
          {...(currentPage < pageCount && {
            onClick: () => onPageChange(currentPage + 1),
          })}
          className={classNames(
            'relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500  focus:z-20',
            'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400',
            {
              'cursor-default': currentPage === pageCount,
            },
            {
              'hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:text-white':
                currentPage !== pageCount,
            }
          )}
        >
          <span className="sr-only">Next</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </a>
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
