import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';

const SchedulesHome: NextPageWithLayout = () => {
  return (
    <section className="flex flex-col items-center gap-y-5 mt-12 sm:mt-36">
      <h1>Schedules Home</h1>
    </section>
  );
};

export default SchedulesHome;

SchedulesHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
