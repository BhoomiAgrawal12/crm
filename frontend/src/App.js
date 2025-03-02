// import React, { useState } from 'react';
// import './App.css';  // Optional: for styling

// function App() {
//   // State variables for username and password
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   // Handle form submission
//   const handleLogin = (e) => {
//     e.preventDefault(); // Prevent the page from refreshing
//     if (username && password) {
//       alert('Login Successful!');
//     } else {
//       alert('Please fill in both fields!');
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <div className="input-container">
//           <label htmlFor="username">Username</label>
//           <input
//             type="text"
//             id="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Enter username"
//             required
//           />
//         </div>

//         <div className="input-container">
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter password"
//             required
//           />
//         </div>

//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import axios from 'axios';  // Import Axios
import './App.css';

function App() {
  // State variables for username, password, loading, and error
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);  // For showing loading state
  const [error, setError] = useState(null);  // To handle errors

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form refresh behavior

    if (!username || !password) {
      alert("Please fill in both fields!");
      return;
    }

    // Set loading to true while waiting for the response
    setLoading(true);
    setError(null);  // Reset error message before making the request

    try {
      // Send POST request using Axios
      const response = await axios.post('https://example.com/api/login', {
        username,
        password
      });

      // If successful, handle the response (you can store the data like a token)
      alert('Login Successful!');
      console.log(response.data);  // Store the response data, like JWT token, user data, etc.

    } catch (error) {
      // If there's an error (like invalid login), display an error message
      if (error.response) {
        // Server responded with a status code other than 2xx
        setError('Login failed! Please try again.');
      } else {
        // Some network error (no response)
        setError('Network error! Please try again later.');
      }
    } finally {
      // Set loading to false after the request finishes
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

      {/* Display error message if any */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;
