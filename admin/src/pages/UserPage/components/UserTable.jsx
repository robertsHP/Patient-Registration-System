import React from 'react';
import UserRow from './UserRow';

const UserTable = ({ users, setEditingUser, deleteUser }) => {
    return (
        <table>
            <thead>
                <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.length > 0 ? (
                    users.map((user) => (
                        <UserRow key={user.id} user={user} setEditingUser={setEditingUser} deleteUser={deleteUser} />
                    ))
                    ) : (
                    <tr>
                        <td colSpan="3">No users</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default UserTable;
