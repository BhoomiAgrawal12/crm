import React from 'react';
import './UserDash.css';
import SideNav from './SideNav'; // Assuming you have a SideNav component

const UserDash = () => {
  return (
    <div className="user-grid-container">
      <div className="user-header"><SideNav /></div>
      <div className="user-task">task</div>
      <div className="user-deals">deals</div>
      <div className="user-call-logs">call logs</div>
      <div className="user-ravi">ravi</div>
      <div className="user-ayush">ayush</div>
      <div className="user-assign">assign</div>
      <div className="user-TaskToDO">Task to do</div>
      <div className="user-notes">notes</div>
      <div className="user-footer">footer</div>
    </div>
  );
};

export default UserDash;
