import storage from 'lib/client/storage';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from './page';

const Home: NextPageWithLayout = () => {
  const router = useRouter();
  const { data } = useSession();

  const businessUnitRoles = useMemo(
    () => data?.user.business_unit_roles ?? [],
    [data?.user.business_unit_roles]
  );

  useEffect(() => {
    console.log('useEffect - query');
    if (!Object.keys(router.query).length) {
      const redirectTo =
        storage.getBusinessUnit() ??
        businessUnitRoles[0].business_unit ??
        '/404';
      console.log('redirecting to :>> ', redirectTo);
      router.replace(redirectTo);
    }
  }, [router, businessUnitRoles]);

  return (
    <section className="flex flex-col items-center gap-y-5 mt-12 sm:mt-36">
      <h1>Home</h1>
    </section>
  );
};

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
