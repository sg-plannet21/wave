import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import MessageUploadForm from 'features/pages/messages/components/MessageUploadForm';
import { NextPageWithLayout } from 'pages/page';

const SectionsHome: NextPageWithLayout = () => {
  return (
    <ContentLayout title="Message Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        <MessageUploadForm />
      </section>
    </ContentLayout>
  );
};

export default SectionsHome;

SectionsHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
