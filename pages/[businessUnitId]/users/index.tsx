import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import UsersTable from 'features/pages/users/components/UsersTable';
import { NextPageWithLayout } from 'pages/page';

const UsersHome: NextPageWithLayout = () => {
  return (
    <ContentLayout title="Users">
      <UsersTable />
    </ContentLayout>
  );
};

export default UsersHome;

UsersHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
