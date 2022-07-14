import React, { lazy, Suspense } from 'react';

const LazyMission = lazy(() => import('./Mission'));

const Mission = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyMission {...props} />
  </Suspense>
);

export default Mission;
