import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

const RouteDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { routeId } = router.query;

  return (
    <section className="flex flex-col items-center gap-y-5 mt-12 sm:mt-36">
      <h1>Route Details - {routeId}</h1>
    </section>
  );
};

export default RouteDetails;

RouteDetails.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
