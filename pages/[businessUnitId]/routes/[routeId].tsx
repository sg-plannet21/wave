import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import RoutesForm from 'features/pages/routes/components/RoutesForm';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';

// function getKey(id?: string): string | undefined {
//   if (id && id !== 'new') return id;

//   return undefined;
// }

const RouteDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const { routeId, businessUnitId } = router.query;
  // const newRecord = routeId === 'new';
  // const { data, error } = useRoute(newRecord ? undefined : routeId?.toString());

  // if (!newRecord && !data) return <div>Loading..</div>;
  // if (error) return <div>An error has occurred</div>;

  // console.log('data', data);
  // console.log('routeId', routeId);

  function onSuccess() {
    console.log('SUCCESS');
    router.push(`/${businessUnitId}/routes`);
  }

  return (
    <ContentLayout title="Route Details">
      <section className="flex flex-col items-center gap-y-5 mt-12">
        <RoutesForm onSuccess={onSuccess} id={routeId?.toString() ?? 'new'} />
      </section>
    </ContentLayout>
  );
};

export default RouteDetails;

RouteDetails.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
