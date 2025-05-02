import React from "react";
import SideNav from "./SideNav";
import "./LogCalls.css"; // Assuming you have a CSS file for styling

const LogCalls = () => {
  return (
    <div className="logs-container">
      <div className="logs-header">
        <SideNav />
      </div>
      <div className="logs-content">
        <div className="form-container">
          <h2>Create Calls</h2>
          <form className="form">
            {/* Subject */}
            <div className="form-group">
              <label>
                SUBJECT:<span className="required">*</span>
              </label>
              <input type="text" className="input" />
            </div>

            {/* Start Date and Time */}
            <div className="form-group">
              <label>
                START DATE & TIME:<span className="required">*</span>
              </label>
              <div className="datetime-group">
                <input type="date" className="input" />
                <select className="input">
                  <option>05</option>
                  <option>06</option>
                  {/* More options */}
                </select>
                <select className="input">
                  <option>30</option>
                  <option>45</option>
                  {/* More options */}
                </select>
              </div>
            </div>

            {/* Duration */}
            <div className="form-group">
              <label>
                DURATION:<span className="required">*</span>
              </label>
              <div className="datetime-group">
                <select className="input">
                  <option>0</option>
                  <option>1</option>
                  {/* More options */}
                </select>
                <select className="input">
                  <option>15</option>
                  <option>30</option>
                  {/* More options */}
                </select>
              </div>
            </div>

            {/* Status and Related To (Right Side) */}
            <div className="form-group side-by-side">
              <div>
                <label>
                  STATUS:<span className="required">*</span>
                </label>
                <div className="datetime-group">
                  <select className="input">
                    <option>Inbound</option>
                    <option>Outbound</option>
                  </select>
                  <select className="input">
                    <option>Planned</option>
                    <option>Held</option>
                    <option>Not Held</option>
                  </select>
                </div>
              </div>
              <div>
                <label>RELATED TO:</label>
                <div className="datetime-group">
                  <select className="input">
                    <option>Account</option>
                    <option>Contact</option>
                    <option>Lead</option>
                  </select>
                  <input type="text" className="input" />
                </div>
              </div>
            </div>

            {/* Reminders */}
            <div className="form-group">
              <label>REMINDERS:</label>
              <div className="reminder-actions">
                <div className="action">
                  <button className="close-btn">✖</button>
                  <span>Popup</span>
                  <select className="input small-select">
                    <option>10 minutes prior</option>
                    <option>20 minutes prior</option>
                    <option>30 minutes prior</option>
                  </select>
                </div>
                <div className="action">
                  <button className="close-btn">✖</button>
                  <span>Email invitees</span>
                  <select className="input small-select">
                    <option>1 hour prior</option>
                    <option>2 hour prior</option>
                    <option>3 hour prior</option>
                  </select>
                </div>
              </div>
              <div className="invite-actions">
                <button className="invite-btn">👥 Will Westin</button>
                <button className="add-btn">+ Add All Invitees</button>
                <button className="remove-btn">– Remove reminder</button>
              </div>
              <button className="add-reminder-btn">+ Add reminder</button>
            </div>

            {/* Description */}
            <div className="form-group">
              <label>DESCRIPTION:</label>
              <textarea className="textarea" rows="5"></textarea>
            </div>

            {/* Assigned To */}
            <div className="form-group">
              <label>ASSIGNED TO:</label>
              <select className="input">
                <option value="rahul">Tony</option>
                <option value="ramu">will stark</option>
                <option value="sara">Sara</option>
                <option value="nikitta">John</option>
              </select>
            </div>
          </form>
          <div className="button-group">
            <button className="save-btn">Save</button>
            <button className="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogCalls;