import React from 'react';
import RoleRow from './RoleRow';

const RoleTable = ({ roles, setEditingRole, deleteRole }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Role Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {roles.length > 0 ? (
          roles.map((role) => (
            <RoleRow key={role.id} role={role} setEditingRole={setEditingRole} deleteRole={deleteRole} />
          ))
        ) : (
          <tr>
            <td colSpan="3">No roles</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default RoleTable;
