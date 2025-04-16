import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./SideNav.css";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WindowIcon from "@mui/icons-material/Window";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const SideNav = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const [showWindowDropdown, setShowWindowDropdown] = useState(false); // State for WindowIcon dropdown visibility
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [showOpportunityDropdown, setShowOpportunityDropdown] = useState(false);
  const [showLeadsDropdown, setShowLeadsDropdown] = useState(false);

  return (
    <div className="side_nav">
      <div className="nav_logo" onClick={() => navigate("/")}>
        <AcUnitIcon />
      </div>
      <div className="nav_icons">
        <div
          className="nav_icon"
          onMouseEnter={() => setShowWindowDropdown(true)} // Show dropdown on hover
          onMouseLeave={() => setShowWindowDropdown(false)} // Hide dropdown when hover ends
          onClick={() => navigate("/accounts")} // Navigate to "Accounts" page on click
        >
          <WindowIcon />
          {showWindowDropdown && (
            <div className="dropdown_menu">
              <div
                className="dropdown_item"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click event
                  navigate("/create-account");
                }}
              >
                Create Account
              </div>
              <div
                className="dropdown_item"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click event
                  navigate("/accounts");
                }}
              >
                View Accounts
              </div>
              <div
                className="dropdown_item"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click event
                  console.log("ravi3 clicked");
                }}
              >
                other
              </div>
            </div>
          )}
        </div>
        <div
          className="nav_icon"
          onMouseEnter={() => setShowContactDropdown(true)} // Show dropdown on hover
          onMouseLeave={() => setShowContactDropdown(false)} // Hide dropdown when hover ends
          onClick={() => navigate("/contacts")} // Navigate to "contacts" page on click
        >
          <BusinessCenterIcon />
          {showContactDropdown && (
            <div className="dropdown_menu">
              <div
                className="dropdown_item"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click event
                  navigate("/create-contact");
                }}
              >
                Create contact
              </div>
              <div
                className="dropdown_item"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click event
                  navigate("/contacts");
                }}
              >
                View contact
              </div>
              <div
                className="dropdown_item"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click event
                  console.log("ravi3 clicked");
                }}
              >
                other
              </div>
            </div>
          )}
        </div>
        <div
          className="nav_icon"
          onMouseEnter={() => setShowOpportunityDropdown(true)} // Show dropdown on hover
          onMouseLeave={() => setShowOpportunityDropdown(false)} // Hide dropdown when hover ends
          onClick={() => navigate("/opportunities")} // Navigate to "opportunities" page on click
        >
          <PeopleAltIcon />
          {showOpportunityDropdown && (
            <div className="dropdown_menu">
              <div
                className="dropdown_item"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click event
                  navigate("/create-opportunity");
                }}
              >
                Create opportunity
              </div>
              <div
                className="dropdown_item"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click event
                  navigate("/opportunities");
                }}
              >
                View opportunity
              </div>
              <div
                className="dropdown_item"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click event
                  console.log("ravi3 clicked");
                }}
              >
                other
              </div>
            </div>
          )}
        </div>
        <div
          className="nav_icon"
          onMouseEnter={() => setShowLeadsDropdown(true)} // Show dropdown on hover
          onMouseLeave={() => setShowLeadsDropdown(false)} // Hide dropdown when hover ends
          onClick={() => navigate("/leads")} // Navigate to "opportunities" page on click
        >
          <DensityMediumOutlinedIcon />
          {showLeadsDropdown && (
            <div className="dropdown_menu">
              <div
                className="dropdown_item"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click event
                  navigate("/create-lead");
                }}
              >
                Create leads
              </div>
              <div
                className="dropdown_item"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click event
                  navigate("/leads");
                }}
              >
                View leads
              </div>
              <div
                className="dropdown_item"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click event
                  console.log("ravi3 clicked");
                }}
              >
                other
              </div>
            </div>
          )}
        </div>
        <div className="nav_icon">
          <CalendarMonthOutlinedIcon />
        </div>
        <div className="nav_icon">
          <NotificationsOutlinedIcon />
        </div>
        <div
          className="nav_icon"
          onMouseEnter={() => setShowDropdown(true)} // Show dropdown on hover
          onMouseLeave={() => setShowDropdown(false)} // Hide dropdown when hover ends
        >
          <SettingsIcon />
          {showDropdown && (
            <div className="dropdown_menu">
              <div
                className="dropdown_item"
                onClick={() => console.log("item1 clicked")}
              >
                item1
              </div>
              <div
                className="dropdown_item"
                onClick={() => console.log("item2 clicked")}
              >
                item2
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideNav;
