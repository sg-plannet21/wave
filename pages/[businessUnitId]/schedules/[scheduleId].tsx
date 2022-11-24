import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

const ScheduleDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { scheduleId } = router.query;

  return (
    <section className="flex flex-col items-center gap-y-5 mt-12 sm:mt-36">
      <h1>Schedule Details - {scheduleId}</h1>
    </section>
  );
};

export default ScheduleDetails;

ScheduleDetails.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
