import React, {lazy, Suspense} from 'react';

const LazyCreateNewChat = lazy(() => import('./CreateNewChat'));

const CreateNewChat = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
    <Suspense fallback={null}>
        <LazyCreateNewChat {...props} />
    </Suspense>
);

export default CreateNewChat;
