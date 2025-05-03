import React from "react";
import "./ViewCalls.css";
import SideNav from "./SideNav";

const ViewCalls = () => {
  return (
    <div className="calls-container">
      <div className="calls-header">
        <SideNav />
      </div>
      <div className="calls-content">
        <div>
          <h2>View Calls</h2>
          <table
            border="1"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th>Direction</th>
                <th>Subject</th>
                <th>Related to</th>
                <th>Start Date</th>
                <th>Assigned to</th>
                <th>Date Created</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Incoming</td>
                <td>Follow-up</td>
                <td>Client A</td>
                <td>2025-04-26</td>
                <td>John Doe</td>
                <td>2025-04-25</td>
              </tr>
              <tr>
                <td>Outgoing</td>
                <td>Project Discussion</td>
                <td>Client B</td>
                <td>2025-04-27</td>
                <td>Jane Smith</td>
                <td>2025-04-26</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewCalls;
