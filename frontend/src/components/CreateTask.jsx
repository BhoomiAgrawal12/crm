import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
// import "./CreateTask.css"; // Import CSS for styling

const CreateTask = () => {
  const [formData, setFormData] = useState({
    subject: "",
    assigned_to: "",
    status: "",
    start_date: "",
    due_date: "",
    priority: "",
    contact_name: "",
    parent_type: "",
    description: "",
  });

  const [users, setUsers] = useState([]); // State to store users
  const [contacts, setContacts] = useState([]); // State to store contacts
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch users and contacts from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        // Fetch users
        const usersResponse = await axios.get("http://localhost:8000/api/users/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(usersResponse.data);

        // Fetch contacts
        const contactsResponse = await axios.get("http://localhost:8000/api/contacts/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setContacts(contactsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/tasks/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response.data); // Log the response data for debugging

      setSuccess("Task created successfully!");
      setFormData({
        subject: "",
        assigned_to: "",
        status: "",
        start_date: "",
        due_date: "",
        priority: "",
        contact_name: "",
        parent_type: "",
        description: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="CreateTask_container">
      <div className="CreateTask_container1">
        <SideNav />
      </div>
      <div className="CreateTask_container2">
        <h2>Create Task</h2>
        <div className="wrapper">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label>Subject:</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-field">
              <label>Assigned To:</label>
              <select
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleChange}
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-field">
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select a status</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending Input">Pending Input</option>
                <option value="Deferred">Deferred</option>
              </select>
            </div>
            <div className="input-field">
              <label>Start Date:</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-field">
              <label>Due Date:</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-field">
              <label>Priority:</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select a priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="input-field">
              <label>Contact:</label>
              <select
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                required
              >
                <option value="">Select a contact</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.first_name} {contact.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-field">
              <label>Parent Type:</label>
              <select
                name="parent_type"
                value={formData.parent_type}
                onChange={handleChange}
                required
              >
                <option value="">Select a parent type</option>
                <option value="Account">Account</option>
                <option value="Contact">Contact</option>
                <option value="Opportunity">Opportunity</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
            <div className="input-field">
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <button type="submit">Save</button>
              <button onClick={() => navigate("/tasks")}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;