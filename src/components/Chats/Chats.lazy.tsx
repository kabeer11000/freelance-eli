import React, { lazy, Suspense } from 'react';

const LazyChats = lazy(() => import('./Chats'));

const Chats = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyChats {...props} />
  </Suspense>
);

export default Chats;
