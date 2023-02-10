import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';
import { useEffect, useState } from 'react';

const UnassignedEntitiesHome: NextPageWithLayout = () => {
  const [calledPush, setCalledPush] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (calledPush || !router.isReady) return;

    setCalledPush(true);
    router.replace({
      pathname: '/[businessUnitId]/unassigned-entities/[entityId]',
      query: {
        businessUnitId: router.query.businessUnitId,
        entityId: 'entry-points',
      },
    });
  }, [router, calledPush]);

  return null;
};

export default UnassignedEntitiesHome;

UnassignedEntitiesHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
