import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import ScheduleExceptionsTables from 'features/pages/schedule-exceptions/components/ScheduleExceptionsTable';
import { NextPageWithLayout } from 'pages/page';

const ScheduleExceptionsHome: NextPageWithLayout = () => {
  return (
    <ContentLayout title="Schedule Exceptions">
      <ScheduleExceptionsTables />
    </ContentLayout>
  );
};

export default ScheduleExceptionsHome;

ScheduleExceptionsHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
