import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UsersList.css"; // Optional: Add custom styles

const UserList = () => {
  const [users, setUsers] = useState([]); // State to store user accounts
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
  const [error, setError] = useState(""); // State to store errors
  const navigate = useNavigate();

  // Fetch all users and check if the current user is an admin
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        // Fetch the current user's details to check if they are an admin
        const currentUserResponse = await axios.get(
          `http://localhost:8000/api/current-user/${localStorage.getItem("username")}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setIsAdmin(currentUserResponse.data.is_admin);

        // Fetch all users
        const usersResponse = await axios.get("http://localhost:8000/api/users/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(usersResponse.data);
      } catch (err) {
        console.error("Error fetching users:", err.response?.data || err.message);
        setError("Failed to fetch users. Please try again later.");
      }
    };

    fetchUsers();
  }, [navigate]);

  // Navigate to the UserDetails page
  const handleUserClick = (username) => {
    navigate(`/user-details/${username}`);
  };

  // Navigate to the Create User page
  const handleCreateUser = () => {
    navigate("/create-user");
  };

  return (
    <div className="UserList_container">
      <h1>User Accounts</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isAdmin && (
        <button onClick={handleCreateUser} className="create-user-button">
          Create User
        </button>
      )}
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>User Type</th>
            <th>Is Active</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td
                className="clickable"
                onClick={() => handleUserClick(user.username)}
              >
                {user.username}
              </td>
              <td>{user.email}</td>
              <td>{user.full_name || "N/A"}</td>
              <td>{user.user_type || "N/A"}</td>
              <td>{user.is_active ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;