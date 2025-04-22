import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import { FiPlus, FiAlertCircle, FiLoader } from "react-icons/fi";
import "./TaskPage.css";

const TaskPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/tasks/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data || err.message);
      setError("Failed to fetch tasks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  return (
    <div className="task-page-container">
      <div className="task-container1">
        <SideNav />
      </div>
      <div className="task-container2">
        <div className="task-header">
          <h1 className="task-title">Tasks</h1>
          <div className="task-actions">
            <button 
              className="create-task-btn"
              onClick={() => navigate("/create-task")}
            >
              <FiPlus /> Create Task
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <FiAlertCircle /> {error}
          </div>
        )}

        {isLoading ? (
          <div className="loading-state">
            <FiLoader className="spin" size={24} />
          </div>
        ) : tasks.length > 0 ? (
          <div className="task-table-container">
            <table className="task-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Contact</th>
                  <th>Assigned To</th>
                  <th>Due Date</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <span 
                        className="task-link" 
                        onClick={() => navigate(`/task-details/${task.id}`)}
                      >
                        {task.subject || "-"}
                      </span>
                    </td>
                    <td>{getStatusBadge(task.status)}</td>
                    <td className={getPriorityClass(task.priority)}>
                      {task.priority || "-"}
                    </td>
                    <td>{task.contact_name_full || "-"}</td>
                    <td>{task.assigned_to_username || "-"}</td>
                    <td>{formatDate(task.due_date)}</td>
                    <td>{formatDate(task.start_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FiAlertCircle size={48} />
            </div>
            <p className="empty-state-text">No tasks found</p>
            <button 
              className="create-task-btn"
              onClick={() => navigate("/create-task")}
            >
              <FiPlus /> Create Your First Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;