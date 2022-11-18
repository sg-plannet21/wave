import Search from 'components/inputs/Search/';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { useState } from 'react';
import { NextPageWithLayout } from './page';

const Test: NextPageWithLayout = () => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="p-4 h-full bg-gray-50 text-gray-800 dark:bg-slate-700 dark:text-white">
      <h1 className="text-2xl text-purple-700 leading-5 text-center">
        Search Box
      </h1>
      <div className="w-96">
        <Search
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Test;

Test.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
