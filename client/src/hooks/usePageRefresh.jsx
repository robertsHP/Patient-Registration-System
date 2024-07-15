import { useEffect, useState } from 'react';

export default function usePageRefresh() {
    const [refreshed, setRefreshed] = useState(false);

    useEffect(() => {
        // Check if the page was refreshed
        if (sessionStorage.getItem('refreshed') === 'true') {
            setRefreshed(true);
            sessionStorage.removeItem('refreshed'); // Clear the flag after reading
        }

        const handleBeforeUnload = () => {
            // Set the refreshed flag in sessionStorage
            sessionStorage.setItem('refreshed', 'true');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return refreshed;
}