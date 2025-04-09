import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
// import "./TaskDetails.css"; // Import CSS for styling

const TaskDetails = () => {
  const { id } = useParams(); // Get the task ID from the URL
  const navigate = useNavigate();

  const [task, setTask] = useState(null); // State to store task details
  const [formData, setFormData] = useState(null); // State to store editable form data
  const [users, setUsers] = useState([]); // State to store users
  const [contacts, setContacts] = useState([]); // State to store contacts
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

  // Fetch task details, users, and contacts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        // Fetch task details
        const taskResponse = await axios.get(
          `http://localhost:8000/api/task/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTask(taskResponse.data);
        setFormData(taskResponse.data); // Initialize form data with task details

        // Fetch users
        const usersResponse = await axios.get(
          "http://localhost:8000/api/users/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUsers(usersResponse.data);

        // Fetch contacts
        const contactsResponse = await axios.get(
          "http://localhost:8000/api/contacts/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setContacts(contactsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, [id, navigate]);

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

      const response = await axios.put(
        `http://localhost:8000/api/task/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setSuccess("Task updated successfully!");
      setTask(response.data); // Update task details with the response
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  if (!task || !formData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="TaskDetails_container">
      <div className="TaskDetails_container1">
        <SideNav />
      </div>
      <div className="TaskDetails_container2">
        <h2>Task Details</h2>
        <div className="wrapper">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          {isEditing ? (
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
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p>
                <strong>Subject:</strong> {task.subject}
              </p>
              <p>
                <strong>Assigned To:</strong> {task.assigned_to}
              </p>
              <p>
                <strong>Status:</strong> {task.status}
              </p>
              <p>
                <strong>Start Date:</strong> {task.start_date}
              </p>
              <p>
                <strong>Due Date:</strong> {task.due_date}
              </p>
              <p>
                <strong>Priority:</strong> {task.priority}
              </p>
              <p>
                <strong>Contact:</strong> {task.contact_name}
              </p>
              <p>
                <strong>Parent Type:</strong> {task.parent_type}
              </p>
              <p>
                <strong>Description:</strong> {task.description}
              </p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => navigate("/tasks")}>Back to Tasks</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;