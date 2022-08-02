import React, {lazy, Suspense} from 'react';

const LazyTabs = lazy(() => import('./Tabs'));

const Tabs = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
    <Suspense fallback={null}>
        <LazyTabs {...props} />
    </Suspense>
);

export default Tabs;
