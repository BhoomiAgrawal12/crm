// frontend/src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState('');
  const [newUserForm, setNewUserForm] = useState({ username: '', email: '', password: '', is_admin: false }); // New state for form
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/users/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch users');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({
      username: user.username,
      email: user.email,
      password: '',
      is_admin: user.is_admin,
      is_active: user.is_active
    });
  };

  const handleSave = async (username) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:8000/api/users/${username}/`, editForm, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setEditingUser(null);
      fetchUsers();
      alert('User updated successfully!');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDelete = async (username) => {
    if (window.confirm(`Are you sure you want to delete ${username}?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://127.0.0.1:8000/api/users/${username}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
        alert('User deleted successfully!');
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete user');
      }
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    setFilteredUsers(users.filter(user => 
      user.username.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };






<div className="dashboard-header">
  <h2>Admin Dashboard</h2>
  <button onClick={handleLogout} className="logout-btn">Logout</button>
</div>











  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.username || !newUserForm.email || !newUserForm.password) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/api/users/', newUserForm, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setNewUserForm({ username: '', email: '', password: '', is_admin: false }); // Reset form
      fetchUsers(); // Refresh table
      alert('User created successfully!');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create user');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      
      <h3>Create New User</h3>
      <form className="create-user-form" onSubmit={handleCreateUser}>
        <input
          type="text"
          placeholder="Username"
          value={newUserForm.username}
          onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUserForm.email}
          onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUserForm.password}
          onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={newUserForm.is_admin}
            onChange={(e) => setNewUserForm({ ...newUserForm, is_admin: e.target.checked })}
          />
          Admin
        </label>
        <button type="submit">Add User</button>
      </form>

      <h3>All Users</h3>
      <input
        type="text"
        placeholder="Search by username or email..."
        value={search}
        onChange={handleSearch}
        className="search-bar"
      />
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Password (Hashed)</th>
            <th>Admin</th>
            <th>Active</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              {editingUser === user.id ? (
                <>
                  <td><input value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} /></td>
                  <td><input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></td>
                  <td><input type="password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} placeholder="New password" /></td>
                  <td>
                    <select value={editForm.is_admin} onChange={(e) => setEditForm({ ...editForm, is_admin: e.target.value === 'true' })}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </td>
                  <td>
                    <select value={editForm.is_active} onChange={(e) => setEditForm({ ...editForm, is_active: e.target.value === 'true' })}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleSave(user.username)}>Save</button>
                    <button onClick={() => setEditingUser(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.password ? user.password.slice(0, 10) + '...' : 'N/A'} <span title={user.password || 'No password'}>(Hover)</span></td>
                  <td>{user.is_admin ? 'Yes' : 'No'}</td>
                  <td>{user.is_active ? 'Yes' : 'No'}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.username)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}










export default AdminDashboard;