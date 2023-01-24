import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import BusinessUnitsTable from 'features/pages/business-units/components/BusinessUnitsTable';
import { NextPageWithLayout } from 'pages/page';

const BusinessUnitsHome: NextPageWithLayout = () => {
  return (
    <ContentLayout title="Business Units">
      <BusinessUnitsTable />
    </ContentLayout>
  );
};

export default BusinessUnitsHome;

BusinessUnitsHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
