import React, { lazy, Suspense } from 'react';

const LazyChat = lazy(() => import('./Chat'));

const Chat = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyChat {...props} />
  </Suspense>
);

export default Chat;
