import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import './LeadDetails.css'; // Import CSS for styling

const LeadDetails = () => {
  const { id } = useParams(); // Get the lead ID from the URL
  const navigate = useNavigate();
  const [lead, setLead] = useState(null); // State to store lead details
  const [formData, setFormData] = useState(null); // State for editing lead
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit mode
  const [choices, setChoices] = useState({
    title: [],
    status: [],
    lead_source: [],
  }); // State for dropdown options
  const [users, setUsers] = useState([]); // State for users
  const [leads, setLeads] = useState([]); // State for leads for "reports_to"
  const [error, setError] = useState("");

  // Fetch lead details and dropdown options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          setError("You are not authenticated. Please log in.");
          return;
        }

        // Fetch lead details
        const leadResponse = await axios.get(
          `http://localhost:8000/api/lead/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setLead(leadResponse.data);
        setFormData(leadResponse.data); // Initialize form data for editing

        // Fetch dropdown options
        const choicesResponse = await axios.get(
          "http://localhost:8000/api/lead-choices/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setChoices(choicesResponse.data);

        // Fetch users
        const usersResponse = await axios.get(
          "http://localhost:8000/api/users/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUsers(usersResponse.data);

        // Fetch leads for "reports_to"
        const leadsResponse = await axios.get(
          "http://localhost:8000/api/leads/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setLeads(leadsResponse.data);
      } catch (err) {
        console.error(
          "Error fetching data:",
          err.response?.data || err.message
        );
        setError("Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for editing
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("You are not authenticated. Please log in.");
        return;
      }

      const response = await axios.put(
        `http://localhost:8000/api/lead/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setLead(response.data); // Update lead details
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error("Error updating lead:", err.response?.data || err.message);
      setError("Failed to update lead. Please try again.");
    }
  };

  if (!lead || !formData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="LeadDetails_container">
      <div className="LeadDetails_container1">
        <SideNav />
      </div>
      <div className="LeadDetails_container2">
        <div style={{ padding: "20px" }}>
          <h1>Lead Details</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!isEditing ? (
            <div>
              <p>
                <strong>Name:</strong>{" "}
                {`${lead.title} ${lead.first_name} ${lead.last_name}`}
              </p>
              <p>
                <strong>Email:</strong> {lead.email_address}
              </p>
              <p>
                <strong>Mobile:</strong> {lead.mobile}
              </p>
              <p>
                <strong>Office Phone:</strong> {lead.office_phone}
              </p>
              <p>
                <strong>Job Title:</strong> {lead.job_title}
              </p>
              <p>
                <strong>Department:</strong> {lead.department}
              </p>
              <p>
                <strong>Account:</strong> {lead.account_name}
              </p>
              <p>
                <strong>Status:</strong> {lead.status}
              </p>
              <p>
                <strong>Status Description:</strong> {lead.status_description}
              </p>
              <p>
                <strong>Lead Source:</strong> {lead.lead_source}
              </p>
              <p>
                <strong>Lead Source Description:</strong>{" "}
                {lead.lead_source_description}
              </p>
              <p>
                <strong>Opportunity Amount:</strong> {lead.opportunity_amount}
              </p>
              <p>
                <strong>Referred By:</strong> {lead.referred_by}
              </p>
              <p>
                <strong>Reports To:</strong> {lead.reports_to_name || "None"}
              </p>
              <p>
                <strong>Primary Address:</strong>{" "}
                {`${lead.primary_address_street}, ${lead.primary_address_city}, ${lead.primary_address_state}, ${lead.primary_address_postal_code}, ${lead.primary_address_country}`}
              </p>
              <p>
                <strong>Alternate Address:</strong>{" "}
                {`${lead.alternate_address_street}, ${lead.alternate_address_city}, ${lead.alternate_address_state}, ${lead.alternate_address_postal_code}, ${lead.alternate_address_country}`}
              </p>
              <p>
                <strong>Description:</strong> {lead.description}
              </p>
              <p>
                <strong>Assigned To:</strong> {lead.assigned_to_username}
              </p>
              <p>
                <strong>Created By:</strong> {lead.created_by_username}
              </p>
              <p>
                <strong>Modified By:</strong> {lead.modified_by_username}
              </p>
              <button onClick={() => setIsEditing(true)}>Edit Lead</button>
              <button
                onClick={() => navigate("/leads")}
                style={{ marginLeft: "10px" }}
              >
                Back to Leads
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div>
                <label>Title:</label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Title</option>
                  {choices.title.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>First Name:</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Last Name:</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email_address"
                  value={formData.email_address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Mobile:</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Office Phone:</label>
                <input
                  type="text"
                  name="office_phone"
                  value={formData.office_phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Job Title:</label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Department:</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Account:</label>
                <input
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Status</option>
                  {choices.status.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Status Description:</label>
                <textarea
                  name="status_description"
                  value={formData.status_description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Lead Source:</label>
                <select
                  name="lead_source"
                  value={formData.lead_source}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Lead Source</option>
                  {choices.lead_source.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Lead Source Description:</label>
                <textarea
                  name="lead_source_description"
                  value={formData.lead_source_description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Opportunity Amount:</label>
                <input
                  type="number"
                  name="opportunity_amount"
                  value={formData.opportunity_amount}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Referred By:</label>
                <input
                  type="text"
                  name="referred_by"
                  value={formData.referred_by}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Reports To:</label>
                <select
                  name="reports_to"
                  value={formData.reports_to}
                  onChange={handleChange}
                >
                  <option value="">Select a Lead</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.first_name} {lead.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Primary Address:</label>
                <input
                  type="text"
                  name="primary_address_street"
                  placeholder="Street"
                  value={formData.primary_address_street}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="primary_address_city"
                  placeholder="City"
                  value={formData.primary_address_city}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="primary_address_state"
                  placeholder="State"
                  value={formData.primary_address_state}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="primary_address_postal_code"
                  placeholder="Postal Code"
                  value={formData.primary_address_postal_code}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="primary_address_country"
                  placeholder="Country"
                  value={formData.primary_address_country}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Alternate Address:</label>
                <input
                  type="text"
                  name="alternate_address_street"
                  placeholder="Street"
                  value={formData.alternate_address_street}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="alternate_address_city"
                  placeholder="City"
                  value={formData.alternate_address_city}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="alternate_address_state"
                  placeholder="State"
                  value={formData.alternate_address_state}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="alternate_address_postal_code"
                  placeholder="Postal Code"
                  value={formData.alternate_address_postal_code}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="alternate_address_country"
                  placeholder="Country"
                  value={formData.alternate_address_country}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Assigned To:</label>
                <select
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">Save Changes</button>
              <button
                onClick={() => setIsEditing(false)}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
