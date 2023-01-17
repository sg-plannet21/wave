import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import CreateSchedule from 'features/pages/schedules/components/CreateSchedules';
import EditSchedule from 'features/pages/schedules/components/EditSchedules';
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

  function renderComponent() {
    switch (scheduleId) {
      case 'new':
        return <CreateSchedule onSuccess={handleSuccess} />;
      case 'edit':
        return <EditSchedule onSuccess={handleSuccess} />;
      default:
        return (
          <SchedulesForm
            onSuccess={handleSuccess}
            id={scheduleId?.toString() as string}
          />
        );
    }
  }

  return (
    <ContentLayout title="Schedule Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        {/* {scheduleId === 'new' ? (
          <CreateSchedule onSuccess={handleSuccess} />
        ) : (
          <SchedulesForm
            onSuccess={handleSuccess}
            id={scheduleId?.toString() as string}
          />
        )} */}
        {renderComponent()}
      </section>
    </ContentLayout>
  );
};

export default ScheduleDetails;

ScheduleDetails.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
