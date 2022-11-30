import AuthLayout from 'components/layouts/auth/AuthLayout';
import LoginForm from 'features/pages/auth/LoginForm';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from './page';

const Login: NextPageWithLayout = () => {
  const router = useRouter();
  console.log(router.query);

  return <LoginForm onSuccess={() => router.push('/')} />;
};

export default Login;

Login.publicRoute = true;
Login.getLayout = (page) => {
  return <AuthLayout title="Login">{page}</AuthLayout>;
};
