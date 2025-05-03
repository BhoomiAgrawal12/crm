import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    title: "",
    full_name: "",
    notify_on_assignment: false,
    description: "",
    department: "",
    home_phone: "",
    mobile: "",
    work_phone: "",
    address_street: "",
    address_city: "",
    address_state: "",
    address_country: "",
    address_postal_code: "",
    user_type: "",
    is_active: true,
    is_staff: false,
    is_superuser: false,
    assigned_to: "", // This will store the ID of the assigned user
  });
  const [userTypeChoices, setUserTypeChoices] = useState([]);
  const [users, setUsers] = useState([]); // List of users for the assigned_to field
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if the user is an admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/current-user/${localStorage.getItem("username")}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.data.is_admin) {
          alert("You are not authorized to access this page.");
          navigate("/"); // Redirect to home or another appropriate page
        }
      } catch (err) {
        console.error("Error checking admin access:", err.response?.data || err.message);
        navigate("/login");
      }
    };

    checkAdminAccess();
  }, [navigate]);

  // Fetch user type choices
  useEffect(() => {
    const fetchUserTypeChoices = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:8000/api/user-choices/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Map the user type choices to the correct format
        const formattedChoices = response.data.user_type.map(([value, label]) => ({
          value,
          label,
        }));
        setUserTypeChoices(formattedChoices);
      } catch (err) {
        console.error("Error fetching user type choices:", err.response?.data || err.message);
        setError("Failed to fetch user type choices.");
      }
    };

    fetchUserTypeChoices();
  }, []);

  // Fetch all users for the assigned_to field
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:8000/api/users/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(response.data); // Set the list of users
      } catch (err) {
        console.error("Error fetching users:", err.response?.data || err.message);
        setError("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.post(
        "http://localhost:8000/api/create-user/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("User created successfully.");
      navigate("/users-list"); // Redirect to the user list page
    } catch (err) {
      console.error("Error creating user:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to create user. Please try again.");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="CreateUser_container">
      <h1>Create User</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Assigned To:</label>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Notify on Assignment:</label>
          <input
            type="checkbox"
            name="notify_on_assignment"
            checked={formData.notify_on_assignment}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Home Phone:</label>
          <input
            type="text"
            name="home_phone"
            value={formData.home_phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mobile:</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Work Phone:</label>
          <input
            type="text"
            name="work_phone"
            value={formData.work_phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address Street:</label>
          <input
            type="text"
            name="address_street"
            value={formData.address_street}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address City:</label>
          <input
            type="text"
            name="address_city"
            value={formData.address_city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address State:</label>
          <input
            type="text"
            name="address_state"
            value={formData.address_state}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address Country:</label>
          <input
            type="text"
            name="address_country"
            value={formData.address_country}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address Postal Code:</label>
          <input
            type="text"
            name="address_postal_code"
            value={formData.address_postal_code}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>User Type:</label>
          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
          >
            <option value="">Select User Type</option>
            {userTypeChoices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Is Active:</label>
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Is Staff:</label>
          <input
            type="checkbox"
            name="is_staff"
            checked={formData.is_staff}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Is Admin:</label>
          <input
            type="checkbox"
            name="is_superuser"
            checked={formData.is_superuser}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default CreateUser;