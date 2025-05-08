import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import { FiEdit, FiSave, FiX, FiArrowLeft, FiAlertCircle, FiLoader, FiPlus } from "react-icons/fi";
import "./TaskDetails.css";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUpdate, setNewUpdate] = useState(""); // State for new update text

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const [taskResponse, usersResponse, contactsResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/task/${id}/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("http://localhost:8000/api/users/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("http://localhost:8000/api/contacts/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        setTask(taskResponse.data);
        setFormData(taskResponse.data);
        setUsers(usersResponse.data);
        setContacts(contactsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setError("Failed to fetch task details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    if (formData?.start_date && formData?.due_date) {
      const start = new Date(formData.start_date);
      const due = new Date(formData.due_date);
      
      if (start > due) {
        setErrors(prev => ({
          ...prev,
          due_date: "Due date cannot be before start date"
        }));
      } else {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors.due_date;
          return newErrors;
        });
      }
    }
  }, [formData?.start_date, formData?.due_date]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.due_date) newErrors.due_date = "Due date is required";
    if (!formData.assigned_to) newErrors.assigned_to = "Assignee is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
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

      setTask(response.data);
      setIsEditing(false);
      setSuccess("Task updated successfully!");
      setError("");
    } catch (err) {
      console.error("Error updating task:", err.response?.data || err.message);
      setError("Failed to update task. Please check your inputs and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddUpdate = async () => {
    if (!newUpdate.trim()) {
      setError("Update text cannot be empty.");
      return;
    }

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/task/${id}/add-update/`,
        { text: newUpdate },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setTask(response.data); // Update the task with the new updates
      setNewUpdate(""); // Clear the input field
      setError("");
      setSuccess("Update added successfully!");
    } catch (err) {
      console.error("Error adding update:", err.response?.data || err.message);
      setError("Failed to add update. Please try again.");
    }
  };

  const renderUpdates = () => {
    if (!task?.updates || task.updates.length === 0) {
      return <p>No updates available.</p>;
    }

    return (
      <ul className="updates-list">
        {task.updates.map((update, index) => (
          <li key={index} className="update-item">
            <p>{update.text}</p>
            <small>{new Date(update.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    );
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    
    const statusClass = {
      "Not Started": "status-not-started",
      "In Progress": "status-in-progress",
      "Completed": "status-completed",
      "Pending Input": "status-pending-input",
      "Deferred": "status-deferred",
    }[status] || "status-not-started";

    return (
      <span className={`status-badge ${statusClass}`}>
        {status}
      </span>
    );
  };

  const getPriorityClass = (priority) => {
    if (!priority) return "";
    
    return {
      "High": "priority-high",
      "Medium": "priority-medium",
      "Low": "priority-low",
    }[priority] || "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderDetail = (label, value, isStatus = false, isPriority = false) => (
    <div className="detail-section">
      <div className="detail-label">{label}</div>
      <div className={`detail-value ${!value ? 'empty' : ''}`}>
        {isStatus ? getStatusBadge(value) : 
         isPriority ? <span className={getPriorityClass(value)}>{value}</span> :
         value || 'Not specified'}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="TaskDetails_container">
        <div className="TaskDetails_container1">
          <SideNav />
        </div>
        <div className="TaskDetails_container2">
          <div className="loading-message">
            <FiLoader className="spin" size={20} /> Loading task details...
          </div>
        </div>
      </div>
    );
  }

  if (!task || !formData) {
    return (
      <div className="TaskDetails_container">
        <div className="TaskDetails_container1">
          <SideNav />
        </div>
        <div className="TaskDetails_container2">
          <div className="error-message">
            <FiAlertCircle /> Failed to load task details. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="TaskDetails_container">
      <div className="TaskDetails_container1">
        <SideNav />
      </div>
      <div className="TaskDetails_container2">
        <div className="task-details-card">
          {error && (
            <div className="error-message">
              <FiAlertCircle /> {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <div className="task-header">
            <h1 className="task-title">
              {isEditing ? "Edit Task" : task.subject}
            </h1>
            <div className="button-group">
              {!isEditing ? (
                <>
                  <button
                    className="button button-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    className="button button-secondary"
                    onClick={() => navigate("/tasks")}
                  >
                    <FiArrowLeft /> Back to Tasks
                  </button>
                </>
              ) : (
                <button
                  className="button button-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  <FiX /> Cancel
                </button>
              )}
            </div>
          </div>

          {!isEditing ? (
            <div className="detail-view">
              <div>
                {renderDetail("Subject", task.subject)}
                {renderDetail("Status", task.status, true)}
                {renderDetail("Priority", task.priority, false, true)}
                {renderDetail("Start Date", formatDate(task.start_date))}
                {renderDetail("Due Date", formatDate(task.due_date))}
                {renderDetail("Assigned To", task.assigned_to_username)}
                {renderDetail("Contact", task.contact_name_full)}
              </div>
              <div>
                {renderDetail("Parent Type", task.parent_type)}
                {renderDetail("Created By", task.created_by_username)}
                {renderDetail("Date Created", formatDate(task.date_entered))}
                {renderDetail("Modified By", task.modified_by_username)}
                {renderDetail("Date Modified", formatDate(task.date_modified))}
                {renderDetail("Description", task.description)}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              <div>
                <div className="form-group">
                  <label className="form-label required">Subject</label>
                  <input
                    type="text"
                    className={`form-control ${errors.subject ? 'error' : ''}`}
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  {errors.subject && <div className="form-error">{errors.subject}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label required">Status</label>
                  <select
                    className={`form-control ${errors.status ? 'error' : ''}`}
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending Input">Pending Input</option>
                    <option value="Deferred">Deferred</option>
                  </select>
                  {errors.status && <div className="form-error">{errors.status}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label required">Priority</label>
                  <select
                    className={`form-control ${errors.priority ? 'error' : ''}`}
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  {errors.priority && <div className="form-error">{errors.priority}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label required">Start Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.start_date ? 'error' : ''}`}
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                  {errors.start_date && <div className="form-error">{errors.start_date}</div>}
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label className="form-label required">Due Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.due_date ? 'error' : ''}`}
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    required
                  />
                  {errors.due_date && <div className="form-error">{errors.due_date}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label required">Assigned To</label>
                  <select
                    className={`form-control ${errors.assigned_to ? 'error' : ''}`}
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
                  {errors.assigned_to && <div className="form-error">{errors.assigned_to}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Contact</label>
                  <select
                    className="form-control"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                  >
                    <option value="">Select Contact</option>
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.first_name} {contact.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Parent Type</label>
                  <select
                    className="form-control"
                    name="parent_type"
                    value={formData.parent_type}
                    onChange={handleChange}
                  >
                    <option value="">Select Parent Type</option>
                    <option value="Account">Account</option>
                    <option value="Contact">Contact</option>
                    <option value="Opportunity">Opportunity</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="button button-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <FiSave /> Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  <FiX /> Cancel
                </button>
              </div>
            </form>
          )}

          <div className="updates-section">
            <h2>Updates</h2>
            {renderUpdates()}
            <div className="add-update">
              <textarea
                className="form-control"
                placeholder="Add a new update..."
                value={newUpdate}
                onChange={(e) => setNewUpdate(e.target.value)}
              />
              <button className="button button-primary" onClick={handleAddUpdate}>
                <FiPlus /> Add Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;