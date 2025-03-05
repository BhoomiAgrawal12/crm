// frontend/src/components/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Add this for styling

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e, isAdmin = false) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in both fields!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        "username": username,
        "password": password
      });

      const { access, is_admin } = response.data;
      localStorage.setItem('token', access);
      alert('Login Successful!');
      console.log(response.data);

      if (isAdmin && !is_admin) {
        setError('You are not an admin!');
      } else if (isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        setError('Login failed! Please try again.');
      } else {
        setError('Network error! Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login to CRM</h2>
        <form>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              onClick={(e) => handleLogin(e, false)} 
              disabled={loading}
              className="login-btn user-login"
            >
              {loading ? 'Logging in...' : 'User Login'}
            </button>
            <button 
              type="submit" 
              onClick={(e) => handleLogin(e, true)} 
              disabled={loading}
              className="login-btn admin-login"
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default LoginPage;

