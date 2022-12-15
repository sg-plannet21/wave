import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import SectionsTable from 'features/pages/sections/components/SectionsTable';
import { NextPageWithLayout } from 'pages/page';

const SectionsHome: NextPageWithLayout = () => {
  return (
    <ContentLayout title="Sections">
      <SectionsTable />
    </ContentLayout>
  );
};

export default SectionsHome;

SectionsHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
