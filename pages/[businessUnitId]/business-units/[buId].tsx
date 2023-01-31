import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import BusinessUnitsForm from 'features/pages/business-units/components/BusinessUnitsForm';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

const BusinessUnitsDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const { businessUnitId, buId } = router.query;

  function onSuccess() {
    router.push(`/${businessUnitId}/business-units`);
  }

  return (
    <ContentLayout title="Business Unit Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        <BusinessUnitsForm
          onSuccess={onSuccess}
          id={buId?.toString() as string}
        />
      </section>
    </ContentLayout>
  );
};

export default BusinessUnitsDetail;

BusinessUnitsDetail.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
