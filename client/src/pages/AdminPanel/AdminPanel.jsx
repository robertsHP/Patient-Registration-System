import * as React from "react";
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const authProvider = {
    login: ({ username, password }) => {
        const isAuthenticated = username === 'admin' && password === 'password'; // replace with real authentication
        return isAuthenticated ? Promise.resolve() : Promise.reject();
    },
    logout: () => {
        return Promise.resolve();
    },
    checkError: () => {
        return Promise.resolve();
    },
    checkAuth: () => {
        return Promise.resolve();
    },
    getPermissions: () => Promise.resolve(),
};

const AdminPanel = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
        <Resource name="users" list={ListGuesser} />
    </Admin>
);

export default AdminPanel;