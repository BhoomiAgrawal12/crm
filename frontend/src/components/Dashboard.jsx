import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  // Add Axios interceptor to handle token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response, // Pass through successful responses
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expired or unauthorized
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/login'); // Redirect to login page
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
    const fetchActivities = async (url = 'http://localhost:8000/api/activity-logs/') => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          navigate('/login');
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
        console.error('Error fetching activities:', error);
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
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          navigate('/login'); // Redirect to login if no token is found
          return;
        }

        const tasksResponse = await axios.get('http://localhost:8000/api/tasks/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
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
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setActivities(response.data.results || response.data);
      setNextPage(response.data.next);
      setPreviousPage(response.data.previous);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
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
                  {tasks.map((task) => (
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
              <h1>78</h1>
            </div>
            <div><span><PeopleAltIcon /></span></div>
          </div>
          <div className='deals'>
            <div>
              <h4>Deals</h4>
              <h1>136</h1>
            </div>
            <div><span><BusinessCenterIcon /></span></div>
          </div>
        </div>
        <div className='dash-2_2'>
          <div className='recent_deal_block'>
            <div className='recent_block1'>
              <h3>Recent Deals</h3>
              <p>View All</p>
            </div>
            <div className='recent_block2'>
              <div className='recent_deals_items'>
                <div className='re_de_item_1'>
                  <div>logo</div>
                  <div>
                    <h5>319 Haul Road</h5>
                    <p>Glenrock, WY</p>
                  </div>
                </div>
                <div className='re_de_item_2'>
                  <div>
                    <h5>$5750</h5>
                    <p>Nov 14, 07:00 AM</p>
                  </div>
                </div>
              </div>
              <div className='recent_deals_items'>
                <div className='re_de_item_1'>
                  <div>logo</div>
                  <div>
                    <h5>319 Haul Road</h5>
                    <p>Glenrock, WY</p>
                  </div>
                </div>
                <div className='re_de_item_2'>
                  <div>
                    <h5>$5750</h5>
                    <p>Nov 14, 07:00 AM</p>
                  </div>
                </div>
              </div>
              <div className='recent_deals_items'>
                <div className='re_de_item_1'>
                  <div>logo</div>
                  <div>
                    <h5>319 Haul Road</h5>
                    <p>Glenrock, WY</p>
                  </div>
                </div>
                <div className='re_de_item_2'>
                  <div>
                    <h5>$5750</h5>
                    <p>Nov 14, 07:00 AM</p>
                  </div>
                </div>
              </div>
              <div className='recent_deals_items'>
                <div className='re_de_item_1'>
                  <div>logo</div>
                  <div>
                    <h5>319 Haul Road</h5>
                    <p>Glenrock, WY</p>
                  </div>
                </div>
                <div className='re_de_item_2'>
                  <div>
                    <h5>$5750</h5>
                    <p>Nov 14, 07:00 AM</p>
                  </div>
                </div>
              </div>
              <div className='recent_deals_items'>
                <div className='re_de_item_1'>
                  <div>logo</div>
                  <div>
                    <h5>319 Haul Road</h5>
                    <p>Glenrock, WY</p>
                  </div>
                </div>
                <div className='re_de_item_2'>
                  <div>
                    <h5>$5750</h5>
                    <p>Nov 14, 07:00 AM</p>
                  </div>
                </div>
              </div>
              <div className='recent_deals_items'>
                <div className='re_de_item_1'>
                  <div>logo</div>
                  <div>
                    <h5>319 Haul Road</h5>
                    <p>Glenrock, WY</p>
                  </div>
                </div>
                <div className='re_de_item_2'>
                  <div>
                    <h5>$5750</h5>
                    <p>Nov 14, 07:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='progress_block'>
            <div className='prog_block1'>
              <div>
                <div>img</div>
                <div>
                  <h5>1824 Turkey Pen Road</h5>
                  <p>Cleveland, OH 12345</p>
                </div>
              </div>
              <div className='progArrosec'>
                <h6>IN PROGRESS</h6>
                <button><ArrowForwardIcon /></button>
              </div>
            </div>
            <div className='prog_block2'>
              <div className='prog_sec'>
                <div><ControlCameraIcon /></div>
                <div>
                  <h5>17 Nov, 2021</h5>
                  <h4>Installation of new air conditioning system</h4>
                </div>
              </div>
              <div className='prog_sec'>
                <div><ControlCameraIcon /></div>
                <div>
                  <h5>17 Nov, 2021</h5>
                  <h4>Installation of new air conditioning system</h4>
                </div>
              </div>
              <div className='load'>Load More</div>
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
                    {activity.action} at {activity.timestamp}
                  </li>
                ))}
              </ul>
            )}
            <div className="pagination-buttons">
              <button
                onClick={() => handlePageChange(previousPage)}
                disabled={!previousPage || loading}
              >
                &lt; Previous
              </button>
              <button
                onClick={() => handlePageChange(nextPage)}
                disabled={!nextPage || loading}
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;