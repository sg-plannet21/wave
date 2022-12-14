import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import SchedulesTable from 'features/pages/schedules/components/SchedulesTable';
import { NextPageWithLayout } from 'pages/page';

const SchedulesHome: NextPageWithLayout = () => {
  return (
    <ContentLayout title="Schedules">
      <SchedulesTable />
    </ContentLayout>
  );
};

export default SchedulesHome;

SchedulesHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
