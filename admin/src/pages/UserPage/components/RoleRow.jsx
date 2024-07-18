import React from 'react';

const RoleRow = ({ role, setEditingRole, deleteRole }) => {
  return (
    <tr>
      <td>{role.role_name}</td>
      <td>{role.role_description}</td>
      <td>
        <button onClick={() => setEditingRole(role)}>Edit</button>
        <button onClick={() => deleteRole(role.id)}>Delete</button>
      </td>
    </tr>
  );
};

export default RoleRow;