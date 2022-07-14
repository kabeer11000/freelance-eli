import React, { lazy, Suspense } from 'react';

const LazyMissions = lazy(() => import('./Missions'));

const Missions = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyMissions {...props} />
  </Suspense>
);

export default Missions;
