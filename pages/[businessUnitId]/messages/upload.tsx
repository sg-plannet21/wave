import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import MessageUploadForm from 'features/pages/messages/components/MessageUploadForm';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

const SectionsHome: NextPageWithLayout = () => {
  const router = useRouter();
  const { businessUnitId } = router.query;

  function handleSuccess() {
    router.push(`/${businessUnitId}/messages`);
  }

  return (
    <ContentLayout title="Message Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        <MessageUploadForm onSuccess={handleSuccess} />
      </section>
    </ContentLayout>
  );
};

export default SectionsHome;

SectionsHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
