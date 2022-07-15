import React, { lazy, Suspense } from 'react';

const LazyVideoSDKWebView = lazy(() => import('./VideoSDKWebView'));

const VideoSDKWebView = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyVideoSDKWebView {...props} />
  </Suspense>
);

export default VideoSDKWebView;
