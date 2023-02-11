import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import EntryPointsForm from 'features/pages/entry-points/components/EntryPointsForm';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

const SectionsDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { businessUnitId, entryPointId } = router.query;

  function onSuccess() {
    console.log('SUCCESS');
    router.push(`/${businessUnitId}/entry-points`);
  }

  return (
    <ContentLayout title="Entry Point Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        <EntryPointsForm onSuccess={onSuccess} id={String(entryPointId)} />
      </section>
    </ContentLayout>
  );
};

export default SectionsDetails;

SectionsDetails.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
