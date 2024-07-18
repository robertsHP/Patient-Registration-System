import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import RoleTable from './components/RoleTable';
import RoleForm from './components/RoleForm';
import UserRoleTable from './components/UserRoleTable';

import ApiService from '../../services/ApiService';

import './UserPage.css';

export default function UserPage(pages, parentUrlName) {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editingRole, setEditingRole] = useState(null);

    useEffect(() => {
        // Fetch initial data
        ApiService.get('/api/user').then(setUsers);
        ApiService.get('/api/role').then(setRoles);
        ApiService.get('/api/user_role_relation').then(setUserRoles);
    }, []);

    const addUser = (user) => {
        ApiService.post('/api/user', user).then((newUser) => {
            setUsers([...users, newUser]);
        });
    };

    const updateUser = (updatedUser) => {
        ApiService.put(`/api/user/${updatedUser.id}`, updatedUser).then(() => {
            setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
            setEditingUser(null);
        });
    };

    const deleteUser = (id) => {
        ApiService.delete(`/api/user/${id}`).then(() => {
            setUsers(users.filter((user) => user.id !== id));
        });
    };

    const addRole = (role) => {
        ApiService.post('/api/role', role).then((newRole) => {
            setRoles([...roles, newRole]);
        });
    };

    const updateRole = (updatedRole) => {
        ApiService.put(`/api/role/${updatedRole.id}`, updatedRole).then(() => {
            setRoles(roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
            setEditingRole(null);
        });
    };

    const deleteRole = (id) => {
        ApiService.delete(`/api/role/${id}`).then(() => {
            setRoles(roles.filter((role) => role.id !== id));
        });
    };

    const assignRole = (userRole) => {
        ApiService.post('/api/user_role_relation', userRole).then((newUserRole) => {
            setUserRoles([...userRoles, newUserRole]);
        });
    };

    const unassignRole = (id) => {
        ApiService.delete(`/api/user_role_relation/${id}`).then(() => {
            setUserRoles(userRoles.filter((userRole) => userRole.id !== id));
        });
    };

    return (
        <>
            <div className="App">
                <h1>User Management</h1>
                <UserTable 
                    users={users} 
                    setEditingUser={setEditingUser} 
                    deleteUser={deleteUser} 
                />
                <UserForm 
                    addUser={addUser} 
                    updateUser={updateUser} 
                    editingUser={editingUser} 
                />
                <h1>Role Management</h1>
                <RoleTable 
                    roles={roles} 
                    setEditingRole={setEditingRole} 
                    deleteRole={deleteRole} 
                />
                <RoleForm 
                    addRole={addRole} 
                    updateRole={updateRole} 
                    editingRole={editingRole} 
                />
                <h1>User Role Management</h1>
                <UserRoleTable 
                    users={users} 
                    roles={roles} 
                    userRoles={userRoles} 
                    assignRole={assignRole} 
                    unassignRole={unassignRole} 
                />
            </div>
        </>
    );
}