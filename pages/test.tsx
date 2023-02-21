import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';

import Popover from 'components/feedback/popover';
import { NextPageWithLayout } from './page';

const Test: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col">
      Testing..
      <div className="p-20 bg-gray-700">
        <Popover message="This is a test">
          <span>Popover</span>
        </Popover>
      </div>
    </div>
  );
};

export default Test;

Test.publicRoute = true;
Test.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
