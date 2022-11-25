import AudioPlayer from 'components/feedback/audio-player/AudioPlayer';
import Dialog from 'components/feedback/dialog/Dialog';
import Button from 'components/inputs/Button';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';
import { useDisclosure } from 'state/hooks/useDisclosure';

const SchedulesHome: NextPageWithLayout = () => {
  const { isOpen, close, open } = useDisclosure();
  return (
    <section className="flex flex-col items-center gap-y-5 mt-12 sm:mt-36">
      <h1>Schedules Home</h1>
      <Button onClick={open}>Play</Button>
      <Dialog isOpen={isOpen} onClose={close}>
        <AudioPlayer trackList={{ src: '/welcome.m4a', name: 'Welcome' }} />
      </Dialog>
    </section>
  );
};

export default SchedulesHome;

SchedulesHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
