import AudioPlayerDialog from 'components/feedback/audio-player-dialog';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { Route } from 'features/pages/routes/types';
import { NextPageWithLayout } from 'pages/page';
import useCollectionRequest from 'state/hooks/useCollectionRequest';

const SchedulesHome: NextPageWithLayout = () => {
  const { data } = useCollectionRequest<Route>('routes');

  if (data) {
    const route_id = Object.values(data)[0].route_id;
    console.log('route_id :>> ', route_id);
  }

  console.log('data :>> ', data);

  return (
    <section className="flex flex-col items-center gap-y-5 mt-12">
      <h1>Schedules Home</h1>
      <AudioPlayerDialog
        trackList={{ src: '/welcome.m4a', name: 'Welcome' }}
        // triggerButton={<Button className="bg-indigo-600">Play!</Button>}
      />
    </section>
  );
};

export default SchedulesHome;

SchedulesHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
