import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import EntryPointsTable from 'features/pages/entry-points/components/EntryPointsTable';
import { NextPageWithLayout } from 'pages/page';

const SectionsHome: NextPageWithLayout = () => {
  return (
    <ContentLayout title="Entry Points">
      <EntryPointsTable />
    </ContentLayout>
  );
};

export default SectionsHome;

SectionsHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
