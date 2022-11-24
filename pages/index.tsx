import { useRouter } from 'next/router';
import { useEffect } from 'react';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from './page';

const Home: NextPageWithLayout = () => {
  const router = useRouter();
  console.log(router.query);

  useEffect(() => {
    console.log('useEffect - query');
    if (!Object.keys(router.query).length) {
      console.log('redirecting');
      router.replace('/2');
    }
  }, [router]);

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
