import React, { useEffect, useState } from 'react';

function UserManagement() {
  const [userForm, setUserForm] = useState({ username: '', password: '', id: null });
  const [users, setUsers] = useState([]); // Users fetched from the backend

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Save new user to the database
  const saveUserToDatabase = async (user) => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const savedUser = await response.json();
      setUsers([...users, savedUser]); // Add saved user to the users list
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Update an existing user
  const updateUser = async (id, updatedUser) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      setUsers(users.map(user => (user._id === id ? data : user))); // Update users list
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user._id !== id)); // Remove deleted user
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userForm.id) {
      await updateUser(userForm.id, {
        username: userForm.username,
        password: userForm.password,
      });
    } else {
      await saveUserToDatabase({
        username: userForm.username,
        password: userForm.password,
      });
    }
    setUserForm({ username: '', password: '', id: null }); // Reset form
  };

  return (
    <div>
      <h2>User Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={userForm.username}
          onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={userForm.password}
          onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
          required
        />
        <button type="submit">{userForm.id ? 'Update User' : 'Add User'}</button>
      </form>

      <h3>Existing Users</h3>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.username}
            <button onClick={() => setUserForm({ ...user, id: user._id })}>Edit</button>
            <button onClick={() => deleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserManagement;
