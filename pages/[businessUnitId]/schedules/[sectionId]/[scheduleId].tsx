import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

const ScheduleDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { businessUnitId, sectionId, scheduleId } = router.query;

  return (
    <ContentLayout title="Schedule Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        <p>Schedule Details - {scheduleId}</p>
      </section>
    </ContentLayout>
  );
};

export default ScheduleDetails;

ScheduleDetails.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
