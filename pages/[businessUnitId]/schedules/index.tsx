import AudioPlayerDialog from 'components/feedback/audio-player-dialog';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';

const SchedulesHome: NextPageWithLayout = () => {
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
