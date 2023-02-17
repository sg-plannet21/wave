import Spinner from 'components/feedback/spinner/Spinner';
import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { Section } from 'features/pages/sections/types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';
import { useEffect, useMemo, useState } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';

const ScheduleExceptionsHome: NextPageWithLayout = () => {
  const [calledPush, setCalledPush] = useState(false);
  const { data } = useCollectionRequest<Section>('sections');
  const router = useRouter();

  const sections: Section[] = useMemo(() => {
    if (!data) return [];
    return Object.values(data);
  }, [data]);

  useEffect(() => {
    if (!calledPush && sections.length) {
      const redirectTo = `/${router.query.businessUnitId}/schedule-exceptions/${sections[0].section_id}`;
      console.log('redirecting to :>> ', redirectTo);
      setCalledPush(true);
      router.replace(redirectTo);
    }
  }, [calledPush, sections, router]);

  if (data && !sections.length) {
    return (
      <ContentLayout title="No Sections">
        <div className="flex items-center justify-center w-full h-full">
          <h4>No Sections created.</h4>
          <p>
            To create a section go here{' '}
            <Link href={`/${router.query.businessUnitId}/sections`}>
              sections
            </Link>
          </p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Spinner size="xl" />
    </div>
  );
};

export default ScheduleExceptionsHome;

ScheduleExceptionsHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
