import Notifications from 'components/feedback/notifications/Notifications';
import AuthRoute from 'components/utility/AuthRoute';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { NotificationProvider } from 'state/notifications/NotificationContext';
import './globals.css';
import { NextPageWithLayout } from './page';

interface AppPropsWithLayout extends AppProps<{ session: Session }> {
  Component: NextPageWithLayout;
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <SessionProvider session={session}>
        <NotificationProvider>
          <Notifications />
          {Component.publicRoute ? (
            getLayout(<Component {...pageProps} />)
          ) : (
            <AuthRoute>{getLayout(<Component {...pageProps} />)}</AuthRoute>
          )}
        </NotificationProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
