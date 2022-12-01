import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import RouteTable from 'features/pages/routes/components/RoutesTable';
import { NextPageWithLayout } from 'pages/page';

const RoutesHome: NextPageWithLayout = () => {
  return (
    <ContentLayout title="Routes">
      <RouteTable />
    </ContentLayout>
  );
};

export default RoutesHome;

RoutesHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
