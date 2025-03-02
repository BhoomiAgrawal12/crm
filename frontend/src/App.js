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
import './App.css';

function App() {
  // State variables for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);  // To show loading state
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
    setError(null);  // Reset error message

    try {
      // Send POST request to the backend
      const response = await fetch('https://example.com/api/login', {
        method: 'POST', // Specify the method
        headers: {
          'Content-Type': 'application/json', // We are sending JSON data
        },
        body: JSON.stringify({ username, password }), // The payload with login data
      });

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error('Login failed');
      }

      // If successful, parse the response JSON
      const data = await response.json();

      // Handle successful login (you can store a token or redirect, etc.)
      alert('Login Successful!');
      console.log(data);  // You can store the data (e.g., JWT token) as needed
    } catch (error) {
      // Handle error (e.g., show an error message)
      setError('Login failed! Please try again.');
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
