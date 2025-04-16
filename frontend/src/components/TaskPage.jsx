import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";

const TaskPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [error, setError] = useState(""); // State to store errors

  // Function to fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("You are not authenticated. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/tasks/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setTasks(response.data); // Set the fetched tasks to state
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data || err.message);
      setError("Failed to fetch tasks. Please try again later.");
    }
  }, [navigate]); // Include `navigate` as a dependency

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Include `fetchTasks` in the dependency array

  return (
    <div className="task_container">
      <div className="task_container1">
        <SideNav />
      </div>
      <div className="task_container2">
        <h1>Tasks</h1>
        <button onClick={() => navigate("/create-task")}>Create Task</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {tasks.length > 0 ? (
          <table
            border="1"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>Subject</th>
                <th>Contact</th>
                <th>Due Date</th>
                <th>Assigned User</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <button
                      onClick={() => navigate(`/task-details/${task.id}`)}
                      style={{
                        color: "blue",
                        textDecoration: "none",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      {task.subject}
                    </button>
                  </td>
                  <td>{task.contact_name_full}</td>
                  <td>{task.due_date}</td>
                  <td>{task.assigned_to_username}</td>
                  <td>{task.start_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default TaskPage;