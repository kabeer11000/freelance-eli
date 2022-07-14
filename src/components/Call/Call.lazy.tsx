import React, { lazy, Suspense } from 'react';

const LazyCall = lazy(() => import('./Call'));

const Call = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyCall {...props} />
  </Suspense>
);

export default Call;
