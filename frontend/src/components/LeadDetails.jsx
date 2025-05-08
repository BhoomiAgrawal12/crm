import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import './LeadDetails.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

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
  const [success, setSuccess] = useState("");
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
          axios.get(`${API_BASE_URL}/api/lead/${id}/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${API_BASE_URL}/api/lead-choices/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${API_BASE_URL}/api/users/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${API_BASE_URL}/api/leads/`, {
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
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("You are not authenticated. Please log in.");
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/lead/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setLead(response.data);
      setSuccess("Lead updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating lead:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update lead. Please check your inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const AddressSection = ({ prefix, data }) => (
    <div className="address-section">
      <h3>{prefix} Address</h3>
      <div className="address-grid">
        <div className="lead-form-group">
          <label>Street</label>
          <input
            type="text"
            className="form-control"
            name={`${prefix}_street`}
            value={data[`${prefix}_street`] || ""}
            onChange={handleChange}
            placeholder="Street"
          />
        </div>
        <div className="lead-form-group">
          <label>City</label>
          <input
            type="text"
            className="form-control"
            name={`${prefix}_city`}
            value={data[`${prefix}_city`] || ""}
            onChange={handleChange}
            placeholder="City"
          />
        </div>
        <div className="lead-form-group">
          <label>State</label>
          <input
            type="text"
            className="form-control"
            name={`${prefix}_state`}
            value={data[`${prefix}_state`] || ""}
            onChange={handleChange}
            placeholder="State"
          />
        </div>
        <div className="lead-form-group">
          <label>Postal Code</label>
          <input
            type="text"
            className="form-control"
            name={`${prefix}_postal_code`}
            value={data[`${prefix}_postal_code`] || ""}
            onChange={handleChange}
            placeholder="Postal Code"
          />
        </div>
        <div className="lead-form-group">
          <label>Country</label>
          <input
            type="text"
            className="form-control"
            name={`${prefix}_country`}
            value={data[`${prefix}_country`] || ""}
            onChange={handleChange}
            placeholder="Country"
          />
        </div>
      </div>
    </div>
  );

  const renderAddress = (prefix, data) => {
    const street = data[`${prefix}_street`];
    const city = data[`${prefix}_city`];
    const state = data[`${prefix}_state`];
    const postalCode = data[`${prefix}_postal_code`];
    const country = data[`${prefix}_country`];

    if (!street && !city && !state && !postalCode && !country) {
      return "Not specified";
    }

    return (
      <>
        {street && <div>{street}</div>}
        {(city || state) && <div>{[city, state].filter(Boolean).join(", ")}</div>}
        {(postalCode || country) && <div>{[postalCode, country].filter(Boolean).join(" ")}</div>}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="LeadDetails_container">
        <div className="LeadDetails_container1">
          <SideNav />
        </div>
        <div className="LeadDetails_container2">
          <div className="loading-message">
            <div className="spinner"></div>
            Loading lead details...
          </div>
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
        <div className="lead-details-card">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="lead-header">
            <h1 className="lead-title">
              {isEditing ? "Edit Lead" : `${lead.first_name} ${lead.last_name}`}
            </h1>
            <div className="button-group">
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
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(lead);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {!isEditing ? (
            <div className="detail-view">
              <div>
                <div className="detail-section">
                  <div className="detail-label">Title</div>
                  <div className={`detail-value ${!lead.title ? 'empty' : ''}`}>
                    {lead.title || 'Not specified'}
                  </div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">First Name</div>
                  <div className="detail-value">{lead.first_name}</div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Last Name</div>
                  <div className="detail-value">{lead.last_name}</div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{lead.email_address}</div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Mobile</div>
                  <div className={`detail-value ${!lead.mobile ? 'empty' : ''}`}>
                    {lead.mobile || 'Not specified'}
                  </div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Office Phone</div>
                  <div className={`detail-value ${!lead.office_phone ? 'empty' : ''}`}>
                    {lead.office_phone || 'Not specified'}
                  </div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Job Title</div>
                  <div className={`detail-value ${!lead.job_title ? 'empty' : ''}`}>
                    {lead.job_title || 'Not specified'}
                  </div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Department</div>
                  <div className={`detail-value ${!lead.department ? 'empty' : ''}`}>
                    {lead.department || 'Not specified'}
                  </div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Account</div>
                  <div className={`detail-value ${!lead.account_name ? 'empty' : ''}`}>
                    {lead.account_name || 'Not specified'}
                  </div>
                </div>
              </div>
              <div>
                <div className="detail-section">
                  <div className="detail-label">Status</div>
                  <div className={`detail-value ${!lead.status ? 'empty' : ''}`}>
                    {lead.status || 'Not specified'}
                  </div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Status Description</div>
                  <div className={`detail-value ${!lead.status_description ? 'empty' : ''}`}>
                    {lead.status_description || 'Not specified'}
                  </div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Lead Source</div>
                  <div className={`detail-value ${!lead.lead_source ? 'empty' : ''}`}>
                    {lead.lead_source || 'Not specified'}
                  </div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Lead Source Description</div>
                  <div className={`detail-value ${!lead.lead_source_description ? 'empty' : ''}`}>
                    {lead.lead_source_description || 'Not specified'}
                  </div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Billing Address</div>
                  <div className={`detail-value ${!lead.billing_street && !lead.billing_city && !lead.billing_state && !lead.billing_postal_code && !lead.billing_country ? 'empty' : ''}`}>
                    {renderAddress('billing', lead)}
                  </div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Shipping Address</div>
                  <div className={`detail-value ${!lead.shipping_street && !lead.shipping_city && !lead.shipping_state && !lead.shipping_postal_code && !lead.shipping_country ? 'empty' : ''}`}>
                    {renderAddress('shipping', lead)}
                  </div>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Description</div>
                  <div className={`detail-value ${!lead.description ? 'empty' : ''}`}>
                    {lead.description || 'Not specified'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              <div>
                <div className="lead-form-group">
                  <label className="required">Title</label>
                  <select
                    className="form-control"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Title</option>
                    {choices.title?.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lead-form-group">
                  <label className="required">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="first_name"
                    value={formData.first_name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="lead-form-group">
                  <label className="required">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="last_name"
                    value={formData.last_name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="lead-form-group">
                  <label className="required">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email_address"
                    value={formData.email_address || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="lead-form-group">
                  <label>Mobile</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="mobile"
                    value={formData.mobile || ""}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    title="Please enter a 10-digit phone number"
                  />
                </div>

                <div className="lead-form-group">
                  <label>Office Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="office_phone"
                    value={formData.office_phone || ""}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    title="Please enter a 10-digit phone number"
                  />
                </div>
              </div>

              <div>
                <div className="lead-form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="job_title"
                    value={formData.job_title || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="lead-form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    className="form-control"
                    name="department"
                    value={formData.department || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="lead-form-group">
                  <label>Account</label>
                  <input
                    type="text"
                    className="form-control"
                    name="account_name"
                    value={formData.account_name || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="lead-form-group">
                  <label>Status</label>
                  <select
                    className="form-control"
                    name="status"
                    value={formData.status || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    {choices.status?.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lead-form-group">
                  <label>Status Description</label>
                  <textarea
                    className="form-control"
                    name="status_description"
                    value={formData.status_description || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <AddressSection prefix="billing" data={formData} />
              <AddressSection prefix="shipping" data={formData} />

              <div className="lead-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="button button-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(lead);
                  }}
                  disabled={isLoading}
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