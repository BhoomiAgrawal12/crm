import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import './LoginPage.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to handle errors
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });

      if(!response.data.is_active){
        setError("Account is inactive. Please contact the administrator.");
        return;
      }

      // Save tokens to localStorage or cookies
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("username", username);
      localStorage.setItem("is_admin", response.data.is_admin.toString());

      // Redirect to home for all authenticated users
      navigate("/");
    } catch (err) {
      // Handle error response
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="button-group">
            <button type="submit" className="login-btn">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
