import { useState } from 'react';

export const useRefresh = (refetches: (() => Promise<any>)[]) => {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all(refetches.map(fn => fn()));
        setRefreshing(false);
    };

    return { refreshing, onRefresh };
};