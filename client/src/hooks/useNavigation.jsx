import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import AuthService from '../services/AuthService.jsx';
import routes from '../routes/routes.jsx';

const useNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPath, setCurrentPath] = useState(location.pathname);

    useEffect(() => {
        setCurrentPath(location.pathname);
    }, [location]);

    const navigateTo = (path) => {
        navigate(path);
        setCurrentPath(path);
    };

    const checkUrlContains = (url, checkUrl) => {
        return url.includes(checkUrl);
    };

    const ifAuthRoutesContainUrl = (url) => {
        const authUrls = Object.values(routes.auth).map(auth => auth.url);
        return authUrls.some(authUrl => checkUrlContains(url, authUrl));
    };

    const ifSystemRoutesContainUrl = (url) => {
        const systemUrls = Object.values(routes.system.pages).flatMap(
            systemPage => Object.values(systemPage.subPages).map(subPage => subPage.url));
        return systemUrls.some(systemUrl => checkUrlContains(url, systemUrl));
    };

    const redirect = () => {
        if (AuthService.ifLoggedIn()) {
            if(!ifSystemRoutesContainUrl(currentPath)){
                navigateTo(routes.system.mainUrl);
                console.log("SYSTEM");
            }
        } else {
            if(!ifAuthRoutesContainUrl(currentPath)){
                navigateTo(routes.auth.mainUrl);
                console.log("AUTH");
            }
        }
    };

    return { navigateTo, currentPath, redirect };
};

export default useNavigation;
