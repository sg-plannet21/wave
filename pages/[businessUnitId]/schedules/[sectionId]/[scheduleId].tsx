import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import CreateSchedule from 'features/pages/schedules/components/CreateSchedule';
import SchedulesForm from 'features/pages/schedules/components/SchedulesForm';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

const ScheduleDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { businessUnitId, sectionId, scheduleId } = router.query;

  function handleSuccess() {
    console.log('SUCCESS');
    router.push(`/${businessUnitId}/schedules/${sectionId}`);
  }

  return (
    <ContentLayout title="Schedule Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        {scheduleId === 'new' ? (
          <CreateSchedule />
        ) : (
          <SchedulesForm
            onSuccess={handleSuccess}
            id={scheduleId?.toString() ?? 'new'}
          />
        )}
      </section>
    </ContentLayout>
  );
};

export default ScheduleDetails;

ScheduleDetails.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
