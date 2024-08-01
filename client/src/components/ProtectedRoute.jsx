import React from 'react';

import { Navigate } from 'react-router-dom';

import AuthService from '../services/AuthService';

const ProtectedRoute = ({ children }) => {
    if (!AuthService.isAuthenticated()) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" replace />;
    }
    // Render the protected component if authenticated
    return children;
};

export default ProtectedRoute;
