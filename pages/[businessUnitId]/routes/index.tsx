import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from 'pages/page';

const RoutesHome: NextPageWithLayout = () => {
  return (
    <section className="flex flex-col items-center gap-y-5 mt-12 sm:mt-36">
      <h1>Routes Home</h1>
    </section>
  );
};

export default RoutesHome;

RoutesHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
