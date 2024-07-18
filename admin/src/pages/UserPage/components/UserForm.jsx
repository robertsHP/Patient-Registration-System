import React, { useState, useEffect } from 'react';

const UserForm = ({ addUser, updateUser, editingUser }) => {
    const [user, setUser] = useState({ username: '', email: '', password_hash: '' });

    useEffect(() => {
        if (editingUser) setUser(editingUser);
    }, [editingUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            updateUser(user);
        } else {
            addUser(user);
        }
        setUser({ username: '', email: '', password_hash: '' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={user.password_hash}
                onChange={(e) => setUser({ ...user, password_hash: e.target.value })}
                required
            />
            <button type="submit">{editingUser ? 'Update' : 'Add'}</button>
        </form>
    );
};

export default UserForm;
