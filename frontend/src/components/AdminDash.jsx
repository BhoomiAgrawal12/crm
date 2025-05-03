import React from 'react';
import './AdminDash.css';
import SideNav from './SideNav';

const AdminDash = () => {
  return (
    <div className="admin-grid-container">
      <div className="admin-header"><SideNav /></div>
      <div className="admin-task">task</div>
      <div className="admin-deals">deals</div>
      <div className="admin-call-logs">call logs</div>
      <div className="admin-ravi">ravi</div>
      <div className="admin-ayush">ayush</div>
      <div className="admin-assign">assign</div>
      <div className="admin-graph">graph</div>
      <div className="admin-footer">footer</div>
    </div>
  );
};

export default AdminDash;
