import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import MessagesTable from 'features/pages/messages/components/MessagesTable';
import { NextPageWithLayout } from 'pages/page';

const MessagesHome: NextPageWithLayout = () => {
  return (
    <ContentLayout title="Messages">
      <MessagesTable />
    </ContentLayout>
  );
};

export default MessagesHome;

MessagesHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
