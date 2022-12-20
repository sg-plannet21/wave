import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import SchedulesForm from 'features/pages/schedules/components/SchedulesForm';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

function handleSuccess() {
  console.log('success');
}

const ScheduleDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { scheduleId } = router.query;

  return (
    <ContentLayout title="Schedule Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        <SchedulesForm
          onSuccess={handleSuccess}
          id={scheduleId?.toString() ?? 'new'}
        />
      </section>
    </ContentLayout>
  );
};

export default ScheduleDetails;

ScheduleDetails.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
