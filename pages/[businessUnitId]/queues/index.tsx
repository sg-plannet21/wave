import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import QueuesTable from 'features/pages/queues/components/QueuesTable';
import { NextPageWithLayout } from 'pages/page';

const MenusHome: NextPageWithLayout = () => {
  return (
    <ContentLayout title="Queues">
      <QueuesTable />
    </ContentLayout>
  );
};

export default MenusHome;

MenusHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
