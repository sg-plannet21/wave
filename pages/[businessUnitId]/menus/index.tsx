import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import MenusTable from 'features/pages/menus/components/MenusTable';
import { NextPageWithLayout } from 'pages/page';

const MenusHome: NextPageWithLayout = () => {
  return (
    <ContentLayout title="Menus">
      <MenusTable />
    </ContentLayout>
  );
};

export default MenusHome;

MenusHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
