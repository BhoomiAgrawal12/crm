import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserDetails = () => {
  const { username } = useParams(); // Get username from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State to store user details
  const [error, setError] = useState(""); // State to store errors
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is admin
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({}); // State for form data

  // Fetch current user role to check if admin
  const checkAdmin = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/current-user/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.is_staff) {
        setIsAdmin(true); // User is admin
      } else {
        setIsAdmin(false); // User is not admin
      }
    } catch (err) {
      console.error("Error checking admin status:", err.response?.data || err.message);
      setError("Failed to verify user role. Please try again later.");
    }
  }, [navigate]);

  // Fetch user details
  const fetchUserDetails = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/users/${username}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser(response.data);
      setFormData(response.data); // Initialize form data with user details
    } catch (err) {
      console.error("Error fetching user details:", err.response?.data || err.message);
      setError("Failed to fetch user details. Please try again later.");
    }
  }, [username, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for editing
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.put(
        `http://localhost:8000/api/users/${username}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setUser(response.data); // Update user details
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error("Error updating user:", err.response?.data || err.message);
      setError("Failed to update user. Please try again later.");
    }
  };

  useEffect(() => {
    checkAdmin(); // Check if the user is admin
  }, [checkAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchUserDetails(); // Fetch user details only if admin
    }
  }, [isAdmin, fetchUserDetails]);

  if (!isAdmin) {
    return <p style={{ color: "red", textAlign: "center" }}>Unauthorized: You do not have permission to view this page.</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Details</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div>
            <label>Is Active:</label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
          </div>
          <div>
            <label>Is Staff:</label>
            <input
              type="checkbox"
              name="is_staff"
              checked={formData.is_staff}
              onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })}
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Is Active:</strong> {user.is_active ? "Yes" : "No"}</p>
          <p><strong>Is Staff:</strong> {user.is_staff ? "Yes" : "No"}</p>
          <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => navigate("/accounts")}>Back to Accounts</button>
        </div>
      )}
    </div>
  );
};

export default UserDetails;