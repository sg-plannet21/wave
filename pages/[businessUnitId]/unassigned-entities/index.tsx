import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import MessagesTable from 'features/pages/messages/components/MessagesTable';
import { NextPageWithLayout } from 'pages/page';

const UnassignedEntitiesHome: NextPageWithLayout = () => {
  return (
    <ContentLayout title="Unassigned Entities">
      <MessagesTable />
    </ContentLayout>
  );
};

export default UnassignedEntitiesHome;

UnassignedEntitiesHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
