import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import './OpportunityPage.css'; // Importing CSS for styling

const OpportunityPage = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]); // State to store accounts
  const [error, setError] = useState(""); // State to store errors

  // Function to fetch accounts
  const fetchOpportunites = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("You are not authenticated. Please log in.");
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/opportunities/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setOpportunities(response.data); // Set the fetched accounts to state
    } catch (err) {
      console.error(
        "Error fetching opportunities:",
        err.response?.data || err.message
      );
      setError("Failed to fetch opportunities. Please try again later.");
    }
  };

  // Fetch accounts on component mount
  useEffect(() => {
    fetchOpportunites();
  }, []);

  return (
    <div className="OpportunityPage_container">
      <div className="OpportunityPage_container1">
        <SideNav />
      </div>
      <div className="OpportunityPage_container2">
        <div style={{ padding: "20px" }}>
          <h1>Opportunities</h1>
          <button onClick={() => navigate("/create-opportunity")}>
            Create Opportunity
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {opportunities.length > 0 ? (
            <table
              border="1"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Account Name</th>
                  <th>Sale Stage</th>
                  <th>Amount</th>
                  <th>Close</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opportunity) => (
                  <tr key={opportunity.id}>
                    <td>
                      <button
                        onClick={() =>
                          navigate(`/opportunity-details/${opportunity.id}`)
                        }
                        style={{
                          color: "blue",
                          textDecoration: "underline",
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        {opportunity.opportunity_name}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(`/account-details/${opportunity.account}`)
                        }
                        style={{
                          color: "blue",
                          textDecoration: "underline",
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        {opportunity.account_name}
                      </button>
                    </td>
                    <td>{opportunity.sales_stage}</td>
                    <td>
                      {opportunity.currency} {opportunity.opportunity_amount}
                    </td>
                    <td>{opportunity.expected_close_date}</td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(
                            `/user-details/${opportunity.assigned_to_username}`
                          )
                        }
                        style={{
                          color: "blue",
                          textDecoration: "underline",
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        {opportunity.assigned_to_username}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No opportunities found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityPage;
