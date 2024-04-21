import React, { useEffect, useState } from 'react';

export default function usePageManagementHook(p, pID) {
    const [pages, setPages] = useState(p);
    const [pageID, setPageID] = useState(pID);

    const getPageByID = (id) => {
        return pages.find(page => page.id === id);
    }

    return { pages, setPages, pageID, setPageID, getPageByID };
}