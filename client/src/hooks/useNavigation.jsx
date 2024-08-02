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

    const redirect = () => {
        if (AuthService.ifLoggedIn()) {
            navigateTo(routes.system.mainUrl);
            console.log("SYSTEM");
        } else {
            navigateTo(routes.auth.mainUrl);
            console.log("AUTH");
        }
    };

    return { navigateTo, currentPath, redirect };
};

export default useNavigation;
