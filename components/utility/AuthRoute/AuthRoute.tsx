import Spinner from 'components/feedback/spinner/Spinner';
import { setAuthHeader } from 'lib/client/axios';
import storage from 'lib/client/storage';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { BusinessUnitRole } from 'state/auth/types';
import BusinessUnitContext from 'state/business-units/BusinessUnitContext';
// https://cloudcoders.xyz/blog/create-protected-routes-in-nextjs/

type AuthRouteProps = {
  children: React.ReactNode;
};

// function getBusinessUnit(
//   businessUnit: string,
//   businessUnits: BusinessUnitRole[]
// ): BusinessUnitRole | undefined {
//   return businessUnits.find((bu) => bu.business_unit === businessUnit);
// }

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const [calledPush, setCalledPush] = useState(false);
  const { data: user, status } = useSession();
  const router = useRouter();
  const { activeBusinessUnit, setActiveBusinessUnit } =
    useContext(BusinessUnitContext);
  const isAuthUser = !user?.error && !!user?.accessToken;

  useEffect(() => {
    if (status === 'loading') return;
    if (!isAuthUser) signIn();
  }, [isAuthUser, status]);

  useEffect(() => {
    if (activeBusinessUnit || calledPush || !router.isReady || !user?.user)
      return;

    console.log('useEffect - AuthRoute');
    console.log('activeBusinessUnit :>> ', activeBusinessUnit);
    console.log('calledPush :>> ', calledPush);
    console.log('router.isReady :>> ', router.isReady);
    console.log('user :>> ', user);

    // user has no business units
    if (!user.user.business_unit_roles.length) {
      console.log('no business units assigned to user :>> ');
      router.push('/login?reason=noBUs');
      return;
    }

    const getBusinessUnit = (
      businessUnitId: string
    ): BusinessUnitRole | undefined =>
      user.user.business_unit_roles.find(
        (bu) => bu.business_unit === businessUnitId
      );

    // reroute requests from the base dir to BU home
    if (router.pathname === '/') {
      console.log('pathname', router.pathname);
      console.log('redirecting from /');
      const selectedBusinessUnit =
        getBusinessUnit(storage.getBusinessUnit()) ??
        user.user.business_unit_roles[0];

      setActiveBusinessUnit({
        id: selectedBusinessUnit.business_unit,
        name: selectedBusinessUnit.business_unit_name,
      });

      const businessUnitId = selectedBusinessUnit.business_unit;

      setCalledPush(true);
      router.replace({
        pathname: '/[businessUnitId]',
        query: { businessUnitId },
      });
    }
    // initialise the active business unit
    else if (router.query.businessUnitId) {
      console.log('pathname', router.pathname);
      console.log('initialise the active business unit');
      const businessUnit = getBusinessUnit(
        router.query.businessUnitId.toString()
      );
      if (businessUnit) {
        setActiveBusinessUnit({
          id: businessUnit.business_unit,
          name: businessUnit.business_unit_name,
        });
      }
      // setCalledPush(true);
      // router.replace('/404');
    }
  }, [activeBusinessUnit, calledPush, user, router, setActiveBusinessUnit]);

  // useEffect(() => {
  //   if (
  //     !activeBusinessUnit &&
  //     user?.user.business_unit_roles &&
  //     router.query.businessUnitId
  //   ) {
  //     console.log('useEffect - initialise BU context value');
  //     const businessUnit = getBusinessUnit(
  //       router.query.businessUnitId.toString(),
  //       user.user.business_unit_roles
  //     );
  //     if (businessUnit) {
  //       setActiveBusinessUnit({
  //         id: businessUnit.business_unit,
  //         name: businessUnit.business_unit_name,
  //       });
  //     }
  //   }
  // }, [activeBusinessUnit, user?.user, router.query, setActiveBusinessUnit]);

  // useEffect(() => {
  //   if (
  //     !activeBusinessUnit &&
  //     !calledPush &&
  //     !Object.keys(router.query).length &&
  //     user?.user
  //   ) {
  //     console.log('useEffect - navigate from root');
  //     console.log('router :>> ', router);
  //     console.log('Object.keys(router.query)', Object.keys(router.query));

  //     const selectedBusinessUnit = getBusinessUnit(
  //       storage.getBusinessUnit() ?? user.user.business_unit_roles[0],
  //       user.user.business_unit_roles
  //     );
  //     if (selectedBusinessUnit) {
  //       setActiveBusinessUnit({
  //         id: selectedBusinessUnit.business_unit,
  //         name: selectedBusinessUnit.business_unit_name,
  //       });

  //       const businessUnitId = selectedBusinessUnit.business_unit;

  //       setCalledPush(true);
  //       router.replace({
  //         pathname: '/[businessUnitId]',
  //         query: { businessUnitId },
  //       });
  //     } else {
  //       setCalledPush(true);
  //       router.replace('/404');
  //     }
  //   }
  // }, [
  //   router,
  //   calledPush,
  //   user?.user,
  //   setActiveBusinessUnit,
  //   activeBusinessUnit,
  // ]);

  if (isAuthUser && activeBusinessUnit) {
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
