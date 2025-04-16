import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import './LeadDetails.css';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [choices, setChoices] = useState({
    title: [],
    status: [],
    lead_source: [],
  });
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          setError("You are not authenticated. Please log in.");
          setIsLoading(false);
          return;
        }

        const [leadResponse, choicesResponse, usersResponse, leadsResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/lead/${id}/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("http://localhost:8000/api/lead-choices/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("http://localhost:8000/api/users/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("http://localhost:8000/api/leads/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        setLead(leadResponse.data);
        setFormData(leadResponse.data);
        setChoices(choicesResponse.data);
        setUsers(usersResponse.data);
        setLeads(leadsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

      setLead(response.data);
      setIsEditing(false);
      setError("");
    } catch (err) {
      console.error("Error updating lead:", err.response?.data || err.message);
      setError("Failed to update lead. Please check your inputs and try again.");
    }
  };

  const renderDetail = (label, value) => (
    <div className="detail-group">
      <div className="detail-label">{label}</div>
      <div className={`detail-value ${!value ? 'empty' : ''}`}>
        {value || 'Not specified'}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="LeadDetails_container">
        <div className="LeadDetails_container1">
          <SideNav />
        </div>
        <div className="LeadDetails_container2">
          <div className="loading-message">Loading lead details...</div>
        </div>
      </div>
    );
  }

  if (!lead || !formData) {
    return (
      <div className="LeadDetails_container">
        <div className="LeadDetails_container1">
          <SideNav />
        </div>
        <div className="LeadDetails_container2">
          <div className="error-message">
            Failed to load lead details. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="LeadDetails_container">
      <div className="LeadDetails_container1">
        <SideNav />
      </div>
      <div className="LeadDetails_container2">
        <div className="lead-details-content">
          {error && <div className="error-message">{error}</div>}

          <div className="lead-header">
            <h1>
              {isEditing ? "Edit Lead" : `${lead.first_name} ${lead.last_name}`}
            </h1>
            <div className="lead-actions">
              {!isEditing ? (
                <>
                  <button
                    className="button button-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Lead
                  </button>
                  <button
                    className="button button-secondary"
                    onClick={() => navigate("/leads")}
                  >
                    Back to Leads
                  </button>
                </>
              ) : (
                <button
                  className="button button-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel Editing
                </button>
              )}
            </div>
          </div>

          {!isEditing ? (
            <div className="lead-details-grid">
              <div>
                {renderDetail("Title", lead.title)}
                {renderDetail("First Name", lead.first_name)}
                {renderDetail("Last Name", lead.last_name)}
                {renderDetail("Email", lead.email_address)}
                {renderDetail("Mobile", lead.mobile)}
                {renderDetail("Office Phone", lead.office_phone)}
                {renderDetail("Job Title", lead.job_title)}
                {renderDetail("Department", lead.department)}
                {renderDetail("Account", lead.account_name)}
                {renderDetail("Status", lead.status)}
                {renderDetail("Status Description", lead.status_description)}
              </div>
              <div>
                {renderDetail("Lead Source", lead.lead_source)}
                {renderDetail("Lead Source Description", lead.lead_source_description)}
                {renderDetail("Opportunity Amount", lead.opportunity_amount)}
                {renderDetail("Referred By", lead.referred_by)}
                {renderDetail("Reports To", lead.reports_to_name)}
                {renderDetail(
                  "Primary Address",
                  `${lead.primary_address_street}, ${lead.primary_address_city}, ${lead.primary_address_state}, ${lead.primary_address_postal_code}, ${lead.primary_address_country}`
                )}
                {renderDetail(
                  "Alternate Address",
                  `${lead.alternate_address_street}, ${lead.alternate_address_city}, ${lead.alternate_address_state}, ${lead.alternate_address_postal_code}, ${lead.alternate_address_country}`
                )}
                {renderDetail("Description", lead.description)}
                {renderDetail("Assigned To", lead.assigned_to_username)}
                {renderDetail("Created By", lead.created_by_username)}
                {renderDetail("Modified By", lead.modified_by_username)}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              <div>
                <div className="form-group">
                  <label>Title</label>
                  <select
                    className="form-control"
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

                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email_address"
                    value={formData.email_address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Office Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="office_phone"
                    value={formData.office_phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    className="form-control"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Account</label>
                  <input
                    type="text"
                    className="form-control"
                    name="account_name"
                    value={formData.account_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-control"
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

                <div className="form-group">
                  <label>Status Description</label>
                  <textarea
                    className="form-control"
                    name="status_description"
                    value={formData.status_description}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Lead Source</label>
                  <select
                    className="form-control"
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

                <div className="form-group">
                  <label>Lead Source Description</label>
                  <textarea
                    className="form-control"
                    name="lead_source_description"
                    value={formData.lead_source_description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Primary Address</label>
                <div className="address-group">
                  <input
                    type="text"
                    className="form-control"
                    name="primary_address_street"
                    placeholder="Street"
                    value={formData.primary_address_street}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="form-control"
                    name="primary_address_city"
                    placeholder="City"
                    value={formData.primary_address_city}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="form-control"
                    name="primary_address_state"
                    placeholder="State"
                    value={formData.primary_address_state}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="form-control"
                    name="primary_address_postal_code"
                    placeholder="Postal Code"
                    value={formData.primary_address_postal_code}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="form-control"
                    name="primary_address_country"
                    placeholder="Country"
                    value={formData.primary_address_country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Alternate Address</label>
                <div className="address-group">
                  <input
                    type="text"
                    className="form-control"
                    name="alternate_address_street"
                    placeholder="Street"
                    value={formData.alternate_address_street}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="form-control"
                    name="alternate_address_city"
                    placeholder="City"
                    value={formData.alternate_address_city}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="form-control"
                    name="alternate_address_state"
                    placeholder="State"
                    value={formData.alternate_address_state}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="form-control"
                    name="alternate_address_postal_code"
                    placeholder="Postal Code"
                    value={formData.alternate_address_postal_code}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="form-control"
                    name="alternate_address_country"
                    placeholder="Country"
                    value={formData.alternate_address_country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="button button-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;