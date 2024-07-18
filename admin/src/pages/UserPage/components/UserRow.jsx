import React from 'react';

const UserRow = ({ user, setEditingUser, deleteUser }) => {
    return (
        <tr>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>
                <button onClick={() => setEditingUser(user)}>Edit</button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
            </td>
        </tr>
    );
};

export default UserRow;