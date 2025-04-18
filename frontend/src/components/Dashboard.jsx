import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import './Dashboard.css';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import axios from 'axios'; // Import axios
import { colors } from '@mui/material';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [metrics, setMetrics] = useState({
    customer_count: 0,
    deal_count: 0,
    recent_leads: [],
    task_stats: [],
    tasks_by_status: {}
  });

  useEffect(() => {
    // Check if the user is authenticated
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      // Redirect to login page if not authenticated
      navigate('/login');
    }
    // Check if user is admin
    const isAdminUser = localStorage.getItem('is_admin') === 'true';
    setIsAdmin(isAdminUser);
  }, [navigate]);

  useEffect(() => {
    // Fetch activity logs, tasks and dashboard metrics
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          navigate('/login'); // Redirect to login if no token is found
          return;
        }

        // Fetch activity logs
        const activityResponse = await axios.get('http://localhost:8000/api/activity-logs/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setActivities(activityResponse.data);

        // Fetch tasks
        const tasksResponse = await axios.get('http://localhost:8000/api/tasks/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTasks(tasksResponse.data);

        // Fetch dashboard metrics
        const metricsResponse = await axios.get('http://localhost:8000/api/dashboard-metrics/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMetrics(metricsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to format timestamp
  const formatTimestamp = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className='dash_container'>
      <div className='dash-1'>
        <h1>Dashboard
        <button 
            onClick={async () => {
              try {
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) {
                  navigate('/login'); // Redirect to login if no token is found
                  return;
                }

                // Send POST request to /logout
                await axios.post(
                  'http://localhost:8000/api/logout/',
                  {}, // Empty body
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );

                // Clear tokens from localStorage
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('is_admin');

                // Redirect to login page
                navigate('/login');
              } catch (err) {
                console.error('Logout failed:', err.response?.data || err.message);
                // Optionally, handle logout failure (e.g., show an error message)
              }
            }}>
            Logout
        </button>
        </h1>
      </div>
      <div className='dash-2'>
        <div className='dash-2_1'>
          <div className='task_tab'>
            <h3>Tasks</h3>
            {loading ? (
              <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p>No tasks available.</p>
            ) : (
              <table className='task_table'>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 5).map((task) => (
                    <tr key={task.id}>
                      <td>
                        <Link to={`/task-details/${task.id}`} className='task_link'>
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
          <div className='customers'>
            <div>
              <h4>Customers</h4>
              <h1>{loading ? 'Loading...' : metrics.customer_count}</h1>
            </div>
            <div><span><PeopleAltIcon /></span></div>
          </div>
          <div className='deals'>
            <div>
              <h4>Deals</h4>
              <h1>{loading ? 'Loading...' : metrics.deal_count}</h1>
            </div>
            <div><span><BusinessCenterIcon /></span></div>
          </div>
        </div>
        <div className='dash-2_2'>
          {/* Only show leads section to admin users */}
          {isAdmin && (
            <div className='recent_deal_block'>
              <div className='recent_block1'>
                <h3>Recent Leads</h3>
                <Link to="/leads">
                  <p>View All</p>
                </Link>
              </div>
              <div className='recent_block2'>
                {loading ? (
                  <p>Loading recent leads...</p>
                ) : metrics.recent_leads.length === 0 ? (
                  <p>No leads available.</p>
                ) : (
                  metrics.recent_leads.map((lead) => (
                    <div className='recent_deals_items' key={lead.id}>
                      <div className='re_de_item_1'>
                        <div>
                          <span className="lead-icon">L</span>
                        </div>
                        <div>
                          <h5>{`${lead.first_name} ${lead.last_name}`}</h5>
                          <p>{lead.email}</p>
                        </div>
                      </div>
                      <div className='re_de_item_2'>
                        <div>
                          <h5>{lead.status}</h5>
                          <p>{formatTimestamp(lead.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className='task_status_block'>
            <div className='task_status_header'>
              <h3>Tasks by Status</h3>
              <Link to="/tasks">
                <p>View All</p>
              </Link>
            </div>
            <div className='task_status_content'>
              {loading ? (
                <p>Loading tasks...</p>
              ) : (
                <div className='task_status_grid'>
                  {Object.entries(metrics.tasks_by_status || {}).map(([status, statusTasks]) => (
                    statusTasks.length > 0 && (
                      <div key={status} className='task_status_section'>
                        <h4>{status}</h4>
                        {statusTasks.map(task => (
                          <div key={task.id} className='task_item'>
                            <Link to={`/task-details/${task.id}`}>
                              <p className='task_title'>{task.subject}</p>
                              <div className='task_details'>
                                <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                                <span>Due: {formatDate(task.due_date)}</span>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='dash-2_3'>
          <div>
            <h2>Activity Log</h2>
            {loading ? (
              <p>Loading...</p>
            ) : activities.length === 0 ? (
              <p>No activities to display.</p>
            ) : (
              <ul>
                {activities.map((activity, index) => (
                  <li key={index}>
                    {activity.action} at {formatTimestamp(activity.timestamp)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;