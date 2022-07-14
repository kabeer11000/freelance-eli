import React, { lazy, Suspense } from 'react';

const LazyCalls = lazy(() => import('./Calls'));

const Calls = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyCalls {...props} />
  </Suspense>
);

export default Calls;
