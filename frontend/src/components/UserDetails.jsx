import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SideNav from "./SideNav";
import './UserDetails.css'; // Import CSS for styling

const UserDetails = () => {
  const { username } = useParams(); // Get username from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State to store user details
  const [error, setError] = useState(""); // State to store errors
  const [isSelf, setIsSelf] = useState(false); // State to check if the user is viewing their own details
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is admin
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({}); // State for form data

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

      const { is_self, is_admin, ...userData } = response.data;

      setUser(userData);
      setFormData(userData); // Initialize form data with user details
      setIsSelf(is_self);
      setIsAdmin(is_admin);
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
    fetchUserDetails(); // Fetch user details on component mount
  }, [fetchUserDetails]);

  if (!isSelf && !isAdmin) {
    return <p style={{ color: "red", textAlign: "center" }}>Unauthorized: You do not have permission to view this page.</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="UserDetails_container">
      <div className="UserDetails_container1">
        <SideNav />
      </div>
      <div className="UserDetails_container2">
        <div style={{ padding: "20px" }}>
          <h1>User Details - {user.username}</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {isEditing && isAdmin ? ( // Only allow editing if the user is an admin
            <form onSubmit={handleSubmit}>
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Full Name:</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Notify on Assignment:</label>
                <input
                  type="checkbox"
                  name="notify_on_assignment"
                  checked={formData.notify_on_assignment || false}
                  onChange={(e) =>
                    setFormData({ ...formData, notify_on_assignment: e.target.checked })
                  }
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Department:</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Home Phone:</label>
                <input
                  type="text"
                  name="home_phone"
                  value={formData.home_phone || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Mobile:</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Work Phone:</label>
                <input
                  type="text"
                  name="work_phone"
                  value={formData.work_phone || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Address Street:</label>
                <input
                  type="text"
                  name="address_street"
                  value={formData.address_street || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Address City:</label>
                <input
                  type="text"
                  name="address_city"
                  value={formData.address_city || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Address State:</label>
                <input
                  type="text"
                  name="address_state"
                  value={formData.address_state || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Address Country:</label>
                <input
                  type="text"
                  name="address_country"
                  value={formData.address_country || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Address Postal Code:</label>
                <input
                  type="text"
                  name="address_postal_code"
                  value={formData.address_postal_code || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>User Type:</label>
                <input
                  type="text"
                  name="user_type"
                  value={formData.user_type || ""}
                  onChange={handleChange}
                />
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p><strong>Title:</strong> {user.title || "N/A"}</p>
              <p><strong>Full Name:</strong> {user.full_name || "N/A"}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Notify on Assignment:</strong> {user.notify_on_assignment ? "Yes" : "No"}</p>
              <p><strong>Description:</strong> {user.description || "N/A"}</p>
              <p><strong>Department:</strong> {user.department || "N/A"}</p>
              <p><strong>Home Phone:</strong> {user.home_phone || "N/A"}</p>
              <p><strong>Mobile:</strong> {user.mobile || "N/A"}</p>
              <p><strong>Work Phone:</strong> {user.work_phone || "N/A"}</p>
              <p><strong>Address Street:</strong> {user.address_street || "N/A"}</p>
              <p><strong>Address City:</strong> {user.address_city || "N/A"}</p>
              <p><strong>Address State:</strong> {user.address_state || "N/A"}</p>
              <p><strong>Address Country:</strong> {user.address_country || "N/A"}</p>
              <p><strong>Address Postal Code:</strong> {user.address_postal_code || "N/A"}</p>
              <p><strong>User Type:</strong> {user.user_type || "N/A"}</p>
              {!isAdmin} Something is wrong? Contact Admin for updating your details.
              {isAdmin && <button onClick={() => setIsEditing(true)}>Edit</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;