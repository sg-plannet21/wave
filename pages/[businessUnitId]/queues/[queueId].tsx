import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import QueuesForm from 'features/pages/queues/components/QueuesForm';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

const QueueDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { businessUnitId, queueId } = router.query;

  function onSuccess() {
    console.log('SUCCESS');
    router.push(`/${businessUnitId}/queues`);
  }

  return (
    <ContentLayout title="Queue Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        <QueuesForm onSuccess={onSuccess} id={queueId?.toString() ?? 'new'} />
      </section>
    </ContentLayout>
  );
};

export default QueueDetails;

QueueDetails.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
