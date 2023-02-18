import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import ScheduleExceptionsForm from 'features/pages/schedule-exceptions/components/ScheduleExceptionsForm';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

const ScheduleExceptionDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { businessUnitId, sectionId, scheduleExceptionId } = router.query;

  function onSuccess() {
    router.push(`/${businessUnitId}/schedule-exceptions/${sectionId}`);
  }

  return (
    <ContentLayout title="Schedule Exception Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        <ScheduleExceptionsForm
          onSuccess={onSuccess}
          id={scheduleExceptionId?.toString() ?? 'new'}
        />
      </section>
    </ContentLayout>
  );
};

export default ScheduleExceptionDetails;

ScheduleExceptionDetails.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
