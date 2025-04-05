import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Dashboard.css';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; // Correct import
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import axios from 'axios'; // Import axios

const Dashboard = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      // Redirect to login page if not authenticated
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch activity logs
    const fetchActivities = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          navigate('/login'); // Redirect to login if no token is found
          return;
        }

        const response = await axios.get('http://localhost:8000/api/activity-logs/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [navigate]);

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
          <div className='Appointment'>
            <div>
              <h3>Next Appointment</h3>
              <span><FiberManualRecordIcon /></span>
            </div>
            <div>
              <span><CircleIcon /></span>
              <div>
                <h5>319 Haul Road</h5>
                <p>Glenrock, WY 12345</p>
              </div>
            </div>
            <div>
              <p>Appointment Date</p>
              <h5>Nov 18 2021, 17:00</h5>
            </div>
            <div>
              <div>
                <p>Room Area</p>
                <h5>100 M2</h5>
              </div>
              <div>
                <p>People</p>
                <h5>10</h5>
              </div>
            </div>
            <div>
              <div>
                <p>Price</p>
                <h5>$ 5750</h5>
              </div>
              <div>
                <button>See Details</button>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;