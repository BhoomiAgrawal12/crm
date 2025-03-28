import React from 'react';
// Corrected the path for App.css
import '../App.css';
// Corrected the paths for SideNav and Dashboard
import SideNav from './SideNav';
import Dashboard from './Dashboard';

const Home = () => {
  return (
    <div className="container">
      <div className="container-1">
        <SideNav />
      </div>
      <div className="container-2"><Dashboard /></div>
    </div>
  )
}

export default Home;