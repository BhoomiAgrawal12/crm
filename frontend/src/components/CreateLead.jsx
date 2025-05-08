import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import "./CreateLead.css";

const CreateLead = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    first_name: "",
    last_name: "",
    email_address: "",
    mobile: "",
    office_phone: "",
    job_title: "",
    department: "",
    account_name: "",
    status: "",
    status_description: "",
    lead_source: "",
    lead_source_description: "",
    opportunity_amount: "",
    referred_by: "",
    reports_to: "",
    primary_address_street: "",
    primary_address_postal_code: "",
    primary_address_city: "",
    primary_address_state: "",
    primary_address_country: "",
    alternate_address_street: "",
    alternate_address_postal_code: "",
    alternate_address_city: "",
    alternate_address_state: "",
    alternate_address_country: "",
    description: "",
    assigned_to: "",
  });

  const [choices, setChoices] = useState({
    title: [],
    status: [],
    lead_source: [],
  });

  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const [choicesResponse, usersResponse, leadsResponse] = await Promise.all([
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

        setChoices(choicesResponse.data);
        setUsers(usersResponse.data);
        setLeads(leadsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setError("Failed to fetch required data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email_address)) {
        throw new Error("Please enter a valid email address.");
      }

      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/leads/",
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.status === 201) {
        setSuccess("Lead created successfully! Redirecting...");
        setTimeout(() => navigate("/leads"), 1500);
      }
    } catch (err) {
      console.error("Error creating lead:", err.response?.data || err.message);
      setError(err.message || err.response?.data?.message || "Failed to create lead. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="CreateLead_container">
      <div className="CreateLead_container1">
        <SideNav />
      </div>
      <div className="CreateLead_container2">
        <div className="lead-form">
          <h1>Create Lead</h1>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="lead-form-group">
                <label className="required-field">Title</label>
                <select
                  name="title"
                  value={formData.title}
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
                <label className="required-field">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="lead-form-group">
                <label className="required-field">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="lead-form-group">
                <label className="required-field">Email</label>
                <input
                  type="email"
                  name="email_address"
                  value={formData.email_address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="lead-form-group">
                <label>Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit phone number"
                />
              </div>

              <div className="lead-form-group">
                <label>Office Phone</label>
                <input
                  type="tel"
                  name="office_phone"
                  value={formData.office_phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="lead-form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                />
              </div>

              <div className="lead-form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="lead-form-group">
                <label>Account Name</label>
                <input
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="lead-form-group">
                <label className="required-field">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
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
                <label className="required-field">Lead Source</label>
                <select
                  name="lead_source"
                  value={formData.lead_source}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Lead Source</option>
                  {choices.lead_source?.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lead-form-group">
                <label>Opportunity Amount</label>
                <input
                  type="number"
                  name="opportunity_amount"
                  value={formData.opportunity_amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="lead-form-group">
                <label>Referred By</label>
                <input
                  type="text"
                  name="referred_by"
                  value={formData.referred_by}
                  onChange={handleChange}
                />
              </div>

              <div className="lead-form-group">
                <label>Reports To</label>
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

              <div className="lead-form-group">
                <label className="required-field">Assigned To</label>
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
            </div>

            <div className="lead-form-group">
              <label>Status Description</label>
              <textarea
                name="status_description"
                value={formData.status_description}
                onChange={handleChange}
                placeholder="Enter status details..."
              />
            </div>

            <div className="lead-form-group">
              <label>Lead Source Description</label>
              <textarea
                name="lead_source_description"
                value={formData.lead_source_description}
                onChange={handleChange}
                placeholder="Enter lead source details..."
              />
            </div>

            <div className="address-group">
              <label>Primary Address</label>
              <div className="address-inputs">
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
            </div>

            <div className="address-group">
              <label>Alternate Address</label>
              <div className="address-inputs">
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
            </div>

            <div className="lead-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter lead description..."
              />
            </div>

            <div className="form-buttons">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Lead"}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate("/leads")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLead;