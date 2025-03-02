// src/components/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook from react-router-dom

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();  // This will be used to navigate to the dashboard after login

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form behavior

    if (!username || !password) {
      alert("Please fill in both fields!");
      return;
    }

    setLoading(true);
    setError(null);  // Reset error message

    try {
      // Send POST request to the API to authenticate the user
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        "username":username,
        "password":password
      });

      // If login is successful, redirect to the dashboard page
      alert('Login Successful!');
      console.log(response.data);  // Here you would handle the response, e.g., storing a token

      // Redirect to Dashboard
      navigate('/dashboard');
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
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-container">
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

        <div className="input-container">
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

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default LoginPage;
