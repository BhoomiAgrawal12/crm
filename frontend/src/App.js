import React, { useState } from 'react';
import './App.css';  // Optional: for styling

function App() {
  // State variables for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent the page from refreshing
    if (username && password) {
      alert('Login Successful!');
    } else {
      alert('Please fill in both fields!');
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default App;
