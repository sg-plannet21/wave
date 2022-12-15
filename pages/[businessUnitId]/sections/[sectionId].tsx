import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import SectionsForm from 'features/pages/sections/components/SectionsForm';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

const SectionsDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { businessUnitId, sectionId } = router.query;

  function onSuccess() {
    console.log('SUCCESS');
    router.push(`/${businessUnitId}/sections`);
  }

  return (
    <ContentLayout title="Section Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        <SectionsForm
          onSuccess={onSuccess}
          id={sectionId?.toString() ?? 'new'}
        />
      </section>
    </ContentLayout>
  );
};

export default SectionsDetails;

SectionsDetails.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
