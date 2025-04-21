import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import "./CreateTask.css";

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

  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        setIsLoading(true);
        
        // Fetch users and contacts concurrently
        const [usersResponse, contactsResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/users/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("http://localhost:8000/api/contacts/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        setUsers(usersResponse.data);
        setContacts(contactsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setError("Failed to fetch required data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      // Validate dates
      if (formData.due_date && formData.start_date && new Date(formData.due_date) < new Date(formData.start_date)) {
        throw new Error("Due date cannot be before start date");
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

      setSuccess("Task created successfully!");
      // Reset form but keep the assigned_to and contact_name for quick reuse
      setFormData({
        subject: "",
        assigned_to: formData.assigned_to,
        status: "",
        start_date: "",
        due_date: "",
        priority: "",
        contact_name: formData.contact_name,
        parent_type: "",
        description: "",
      });
      
      // Redirect after 2 seconds if success
      setTimeout(() => navigate("/tasks"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || 
        err.message || 
        "An error occurred while creating the task. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="CreateTask_container">
      <div className="CreateTask_container1">
        <SideNav />
      </div>
      <div className="CreateTask_container2">
        <h2>Create New Task</h2>
        
        <div className="wrapper">
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              <strong>Success:</strong> {success}
            </div>
          )}

          {isLoading && !error ? (
            <div>Loading data...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-field">
                <label htmlFor="subject">Subject *</label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enter task subject"
                />
              </div>

              <div className="input-field">
                <label htmlFor="assigned_to">Assigned To *</label>
                <select
                  id="assigned_to"
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
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending Input">Pending Input</option>
                  <option value="Deferred">Deferred</option>
                </select>
              </div>

              <div className="input-field">
                <label htmlFor="start_date">Start Date *</label>
                <input
                  id="start_date"
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-field">
                <label htmlFor="due_date">Due Date *</label>
                <input
                  id="due_date"
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-field">
                <label htmlFor="priority">Priority *</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="input-field">
                <label htmlFor="contact_name">Contact *</label>
                <select
                  id="contact_name"
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
                <label htmlFor="parent_type">Parent Type *</label>
                <select
                  id="parent_type"
                  name="parent_type"
                  value={formData.parent_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select parent type</option>
                  <option value="Account">Account</option>
                  <option value="Contact">Contact</option>
                  <option value="Opportunity">Opportunity</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>

              <div className="input-field">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter task details..."
                />
              </div>

              <div className="button-group">
                <button type="button" onClick={() => navigate("/tasks")}>
                  Cancel
                </button>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Task"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTask;