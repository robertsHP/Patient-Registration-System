import React from 'react';

import { Navigate } from 'react-router-dom';

import routes from '../routes/routes';
import AuthService from '../services/AuthService';

const ProtectedRoute = ({ children }) => {
    return AuthService.ifLoggedIn() ? children : <Navigate to={routes.login.url} />;
};

export default ProtectedRoute;
