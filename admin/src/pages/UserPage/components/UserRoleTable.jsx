import React, { useState } from 'react';

const UserRoleTable = ({ users, roles, userRoles, assignRole, unassignRole }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleAssign = () => {
    if (selectedUser && selectedRole) {
      assignRole({ user_id: selectedUser.id, role_id: selectedRole.id });
    }
  };

  return (
    <div>
      <h2>Assign Roles to Users</h2>
      <select onChange={(e) => setSelectedUser(users.find((user) => user.id === parseInt(e.target.value)))}>
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>
      <select onChange={(e) => setSelectedRole(roles.find((role) => role.id === parseInt(e.target.value)))}>
        <option value="">Select Role</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.role_name}
          </option>
        ))}
      </select>
      <button onClick={handleAssign}>Assign</button>
      <h2>Assigned Roles</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userRoles.length > 0 ? (
            userRoles.map((userRole) => {
              const user = users.find((u) => u.id === userRole.user_id);
              const role = roles.find((r) => r.id === userRole.role_id);
              return (
                <tr key={userRole.id}>
                  <td>{user ? user.username : 'Unknown User'}</td>
                  <td>{role ? role.role_name : 'Unknown Role'}</td>
                  <td>
                    <button onClick={() => unassignRole(userRole.id)}>Unassign</button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="3">No roles assigned</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserRoleTable;
