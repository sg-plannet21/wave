import classNames from 'classnames';
import MagnifyingGlass from 'components/icons/MagnifyingGlass';

type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

export type SearchProps = WithRequiredProperty<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
>;
// px-2 py-1 text-gray-600 dark:text-slate-400 justify-between border-b border-gray-300
const Search: React.FC<SearchProps> = ({ className, ...rest }) => {
  return (
    <div className="group flex justify-between items-end border-b border-gray-300 px-2 text-gray-500 dark:text-gray-300 dark:border-gray-300">
      <label htmlFor="table-search" className="sr-only">
        Search
      </label>
      <input
        placeholder="Search.."
        className={classNames(
          'w-full bg-transparent border-none focus:outline-none placeholder:font-thin dark:placeholder-gray-300',
          className
        )}
        {...rest}
      />
      <MagnifyingGlass className="w-8 h-8 duration-200 group-hover:scale-110" />
    </div>
  );
};

export default Search;
