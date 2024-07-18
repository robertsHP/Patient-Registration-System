import React, { useState, useEffect } from 'react';

const RoleForm = ({ addRole, updateRole, editingRole }) => {
  const [role, setRole] = useState({ role_name: '', role_description: '' });

  useEffect(() => {
    if (editingRole) setRole(editingRole);
  }, [editingRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRole) {
      updateRole(role);
    } else {
      addRole(role);
    }
    setRole({ role_name: '', role_description: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Role Name"
        value={role.role_name}
        onChange={(e) => setRole({ ...role, role_name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Role Description"
        value={role.role_description}
        onChange={(e) => setRole({ ...role, role_description: e.target.value })}
      />
      <button type="submit">{editingRole ? 'Update' : 'Add'}</button>
    </form>
  );
};

export default RoleForm;
