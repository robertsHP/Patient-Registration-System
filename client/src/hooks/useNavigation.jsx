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
        console.log("----------DOOM------------------");
        console.log(currentPath);
        console.log(location.pathname);
        console.log(path);

        navigate(path);
        setCurrentPath(path);
    };

    const checkUrlContains = (url, checkUrl) => {
        return url.includes(checkUrl);
    };

    const ifAuthRoutesContainUrl = (url) => {
        const authUrls = Object.values(routes.auth.pages).map(auth => auth.url);
        return authUrls.some(authUrl => checkUrlContains(url, authUrl));
    };

    const ifSystemRoutesContainUrl = (url) => {
        const systemUrls = Object.values(routes.system.pages).flatMap(
            systemPage => Object.values(systemPage.subPages).map(subPage => subPage.url));
        return systemUrls.some(systemUrl => checkUrlContains(url, systemUrl));
    };

    const getAuthPage = (url) => {
        const authPages = Object.values(routes.auth.pages);
        return authPages.find(page => page.url === url);
    };
    
    const getSystemPage = (url) => {
        const systemPages = Object.values(routes.system.pages);
        return systemPages.find(page => page.url === url);
    };
    
    const getPageSubPage = (page, url) => {
        const subPages = page.subPages;
        return subPages.find(subPage => subPage.url === url);
    };

    const redirect = () => {
        var redirected = false;

        if (AuthService.ifLoggedIn()) {
            if(!ifSystemRoutesContainUrl(currentPath)){
                navigateTo(routes.system.redirectUrl);
                redirected = true;
            }
        } else {
            if(!ifAuthRoutesContainUrl(currentPath)){
                navigateTo(routes.auth.redirectUrl);
                redirected = true;
            }
        }

        return redirected;
    };

    return { navigateTo, currentPath, redirect };
};

export default useNavigation;
