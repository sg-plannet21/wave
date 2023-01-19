import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';

const SectionsHome: NextPageWithLayout = () => {
  return <ContentLayout title="Add Messages">Upload</ContentLayout>;
};

export default SectionsHome;

SectionsHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
