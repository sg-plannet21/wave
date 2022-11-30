import Spinner from 'components/feedback/spinner/Spinner';
import { setAuthHeader } from 'lib/client/axios';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
// https://cloudcoders.xyz/blog/create-protected-routes-in-nextjs/

type AuthRouteProps = {
  children: React.ReactNode;
};

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { data: user, status } = useSession();
  const isAuthUser = !user?.error && !!user?.accessToken;

  useEffect(() => {
    if (status === 'loading') return;
    if (!isAuthUser) signIn();
  }, [isAuthUser, status]);

  if (isAuthUser) {
    setAuthHeader(user?.accessToken);
    return <>{children}</>;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Spinner size="xl" />
    </div>
  );
};

export default AuthRoute;
