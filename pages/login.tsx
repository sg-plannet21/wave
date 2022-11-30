import { useRouter } from 'next/router';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from './page';

const Login: NextPageWithLayout & { publicRoute: true } = () => {
  const router = useRouter();
  console.log(router.query);

  return (
    <section className="flex flex-col items-center gap-y-5 mt-12 sm:mt-36">
      <h1>Login</h1>
    </section>
  );
};

export default Login;

Login.publicRoute = true;
Login.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
