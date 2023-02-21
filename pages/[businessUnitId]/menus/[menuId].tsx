import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import MenusForm from 'features/pages/menus/components/MenusForm';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

const MenuDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { businessUnitId, menuId } = router.query;

  function onSuccess() {
    console.log('SUCCESS');
    router.push(`/${businessUnitId}/menus`);
  }

  return (
    <ContentLayout title="Menus Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        <MenusForm onSuccess={onSuccess} id={menuId?.toString() ?? 'new'} />
      </section>
    </ContentLayout>
  );
};

export default MenuDetails;

MenuDetails.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
