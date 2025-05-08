import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import axios from "axios";
import "./UserDash.css";
import SideNav from "./SideNav"; // Assuming you have a SideNav component

const UserDash = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response, // Pass through successful responses
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expired or unauthorized
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("username");
          navigate("/login"); // Redirect to login page
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on component unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchActivities = async (
      url = "http://localhost:8000/api/activity-logs/"
    ) => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setActivities(response.data.results || response.data);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [navigate]);

  useEffect(() => {
    // Fetch tasks
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login"); // Redirect to login if no token is found
          return;
        }

        const tasksResponse = await axios.get(
          "http://localhost:8000/api/tasks/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handlePageChange = async (url) => {
    if (!url) return;
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setActivities(response.data.results || response.data);
      setNextPage(response.data.next);
      setPreviousPage(response.data.previous);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-grid-container">
      <div className="user-header">
        <SideNav />
      </div>
      <div className="user-task">
        <div className="task_tab">
          <h3>High Priority Tasks</h3>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks available.</p>
          ) : (
            <table className="task_table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {tasks
                  .filter((task) => task.assigned_to_username === localStorage.getItem("username")) // Show only tasks assigned to the current user
                  .sort((a, b) => {
                    const priorityOrder = { High: 1, Medium: 2, Low: 3 }; // Define priority order
                    return priorityOrder[a.priority] - priorityOrder[b.priority]; // Sort by priority
                  })
                  .map((task) => (
                    <tr key={task.id}>
                      <td>
                        <Link
                          to={`/task-details/${task.id}`}
                          className="task_link"
                        >
                          {task.subject}
                        </Link>
                      </td>
                      <td>{task.due_date}</td>
                      <td>{task.priority}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="user-deals">
        <div className="recent_deal_block">
          <div className="recent_block1">
            <h3>Recent Deals</h3>
            <p>View All</p>
          </div>
          <div className="recent_block2">
            <div className="recent_deals_items">
              <div className="re_de_item_1">
                <div>logo</div>
                <div>
                  <h5>319 Haul Road</h5>
                  <p>Glenrock, WY</p>
                </div>
              </div>
              <div className="re_de_item_2">
                <div>
                  <h5>$5750</h5>
                  <p>Nov 14, 07:00 AM</p>
                </div>
              </div>
            </div>
            <div className="recent_deals_items">
              <div className="re_de_item_1">
                <div>logo</div>
                <div>
                  <h5>319 Haul Road</h5>
                  <p>Glenrock, WY</p>
                </div>
              </div>
              <div className="re_de_item_2">
                <div>
                  <h5>$5750</h5>
                  <p>Nov 14, 07:00 AM</p>
                </div>
              </div>
            </div>
            <div className="recent_deals_items">
              <div className="re_de_item_1">
                <div>logo</div>
                <div>
                  <h5>319 Haul Road</h5>
                  <p>Glenrock, WY</p>
                </div>
              </div>
              <div className="re_de_item_2">
                <div>
                  <h5>$5750</h5>
                  <p>Nov 14, 07:00 AM</p>
                </div>
              </div>
            </div>
            <div className="recent_deals_items">
              <div className="re_de_item_1">
                <div>logo</div>
                <div>
                  <h5>319 Haul Road</h5>
                  <p>Glenrock, WY</p>
                </div>
              </div>
              <div className="re_de_item_2">
                <div>
                  <h5>$5750</h5>
                  <p>Nov 14, 07:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="user-call-logs">call logs</div>
      <div className="user-ravi">
        <div className="customers">
          <div>
            <h4>Customers</h4>
            <h1>78</h1>
          </div>
          <div>
            <span>
              <PeopleAltIcon />
            </span>
          </div>
        </div>
      </div>
      <div className="user-ayush">
        <div className="deals">
          <div>
            <h4>Deals</h4>
            <h1>136</h1>
          </div>
          <div>
            <span>
              <BusinessCenterIcon />
            </span>
          </div>
        </div>
      </div>
      <div className="user-assign">
        <div className="progress_block">
          <div className="prog_block1">
            <div>
              <div>img</div>
              <div>
                <h5>1824 Turkey Pen Road</h5>
                <p>Cleveland, OH 12345</p>
              </div>
            </div>
            <div className="progArrosec">
              <h6>IN PROGRESS</h6>
              <button>
                <ArrowForwardIcon />
              </button>
            </div>
          </div>
          <div className="prog_block2">
            <div className="prog_sec">
              <div>
                <ControlCameraIcon />
              </div>
              <div>
                <h5>17 Nov, 2021</h5>
                <h4>Installation of new air conditioning system</h4>
              </div>
            </div>
            <div className="prog_sec">
              <div>
                <ControlCameraIcon />
              </div>
              <div>
                <h5>17 Nov, 2021</h5>
                <h4>Installation of new air conditioning system</h4>
              </div>
            </div>
            <div className="load">Load More</div>
          </div>
        </div>
      </div>
      <div className="user-TaskToDO">
        <div className="task_tab2">
          <h3>Due Date Tasks</h3>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks available.</p>
          ) : (
            <table className="task_table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {tasks
                  .filter((task) => task.assigned_to_username === localStorage.getItem("username")) // Show only tasks assigned to the current user
                  .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)) // Sort by due date (earliest first)
                  .map((task) => (
                    <tr key={task.id}>
                      <td>
                        <Link to={`/task-details/${task.id}`} className="task_link">
                          {task.subject}
                        </Link>
                      </td>
                      <td>{task.due_date}</td>
                      <td>{task.priority}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="user-notes">notes</div>
      <div className="user-footer">footer</div>
    </div>
  );
};

export default UserDash;
