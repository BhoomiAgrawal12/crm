import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LeadsPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]); // State to store leads
  const [error, setError] = useState(""); // State to store errors

  // Fetch leads from the backend
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          setError("You are not authenticated. Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/leads/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setLeads(response.data); // Set the fetched leads to state
      } catch (err) {
        console.error("Error fetching leads:", err.response?.data || err.message);
        setError("Failed to fetch leads. Please try again later.");
      }
    };

    fetchLeads();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Leads</h1>
      <button onClick={() => navigate("/create-lead")}>Create Lead</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {leads.length > 0 ? (
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Account Name</th>
              <th>Office Phone</th>
              <th>Email</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <button
                    onClick={() => navigate(`/lead-details/${lead.id}`)}
                    style={{
                      color: "blue",
                      textDecoration: "underline",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    {`${lead.title} ${lead.first_name} ${lead.last_name}`}
                  </button>
                </td>
                <td>{lead.status}</td>
                <td>{lead.account_name}</td>
                <td>{lead.office_phone}</td>
                <td>{lead.email_address}</td>
                <td>{lead.assigned_to_username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No leads found.</p>
      )}
    </div>
  );
};

export default LeadsPage;