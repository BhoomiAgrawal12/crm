// src/components/Dashboard.js

//import React from 'react';

//function Dashboard() {
//  return (
//    <div className="dashboard-container">
//      <h2>Welcome to the Dashboard</h2>
//      <p>You are successfully logged in!</p>
//      {/* You can add more features, user info, charts, etc. */}
//    </div>
//  );
//}

//export default Dashboard;








// frontend/src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Create this for styling

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome to the Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      <p>You are successfully logged in!</p>
      {/* Add more user dashboard content here if needed */}
    </div>
  );
}

export default Dashboard;