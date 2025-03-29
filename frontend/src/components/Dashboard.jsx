import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Dashboard.css';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      // Redirect to login page if not authenticated
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className='dash_container'>
      <div className='dash-1'>
        <h1>Dashboard
        <button 
            onClick={() => {
            // Clear tokens from localStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Redirect to login page
            navigate('/');
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
          <div>1</div>
          <div className='task'>
            <div className='task_sec1'>
              <h4>Tasks To Do</h4>
              <h5>View All</h5>
            </div>
            <div className='task_sec2'>
              <div className='task_sec_child'>
                <h5>30 Nov 2021</h5>
                <h5>Meeting with partners</h5>
              </div>
              <div className='task_sec_child'>
                <h5>30 Nov 2021</h5>
                <h5>Meeting with partners</h5>
              </div>
              <div className='task_sec_child'>
                <h5>30 Nov 2021</h5>
                <h5>Meeting with partners</h5>
              </div>
              <div className='task_sec_child'>
                <h5>30 Nov 2021</h5>
                <h5>Meeting with partners</h5>
              </div>
              <div className='task_sec_child'>
                <h5>30 Nov 2021</h5>
                <h5>Meeting with partners</h5>
              </div>
              <div className='task_sec_child'>
                <h5>30 Nov 2021</h5>
                <h5>Meeting with partners</h5>
              </div>
            </div>
            <div className='add_task'>
              <div>Add new task</div>
              <div><ArrowForwardIcon /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;