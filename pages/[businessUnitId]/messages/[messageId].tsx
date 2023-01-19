import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import MessagesForm from 'features/pages/messages/components/MessagesForm';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

const MessagesDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const { businessUnitId, messageId } = router.query;

  function onSuccess() {
    console.log('SUCCESS');
    router.push(`/${businessUnitId}/messages`);
  }

  return (
    <ContentLayout title="Message Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        <MessagesForm
          onSuccess={onSuccess}
          id={messageId?.toString() as string}
        />
      </section>
    </ContentLayout>
  );
};

export default MessagesDetail;

MessagesDetail.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
