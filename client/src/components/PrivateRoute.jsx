// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute ({ element: Component, ...rest }) {
    const token = localStorage.getItem('token');
    const isAuthenticated = token && !isTokenExpired(token); // Assuming you have a function to check token expiry
  
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" replace />;
};
  
function isTokenExpired(token) {
    const decodedToken = jwt.decode(token); // Assuming you use jwt-decode library
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
}
