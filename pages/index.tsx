import Spinner from 'components/feedback/spinner/Spinner';
import storage from 'lib/client/storage';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from './page';

const Home: NextPageWithLayout = () => {
  const [calledPush, setCalledPush] = useState(false);
  const router = useRouter();
  const { data } = useSession();

  const businessUnitRoles = useMemo(
    () => data?.user.business_unit_roles ?? [],
    [data?.user.business_unit_roles]
  );

  useEffect(() => {
    console.log('useEffect - query');
    if (!calledPush && !Object.keys(router.query).length) {
      const redirectTo =
        storage.getBusinessUnit() ??
        businessUnitRoles[0].business_unit ??
        '/404';
      console.log('redirecting to :>> ', redirectTo);
      setCalledPush(true);
      router.replace(redirectTo);
    }
  }, [router, businessUnitRoles, calledPush]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Spinner size="xl" />
    </div>
  );
};

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
