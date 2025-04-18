import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import "./OpportunityDetails.css";

const OpportunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [choices, setChoices] = useState({
    sales_stage: [],
    business_type: [],
    lead_source: [],
    currency: [],
  });
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const [opportunityResponse, choicesResponse, accountsResponse, usersResponse] = await Promise.all([
        axios.get(`http://localhost:8000/api/opportunity/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get("http://localhost:8000/api/opportunity-choices/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get("http://localhost:8000/api/accounts/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get("http://localhost:8000/api/users/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      setOpportunity(opportunityResponse.data);
      setFormData(opportunityResponse.data);
      setChoices(choicesResponse.data);
      setAccounts(accountsResponse.data);
      setUsers(usersResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.put(
        `http://localhost:8000/api/opportunity/${id}/`,
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setOpportunity(response.data);
      setSuccess("Opportunity updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating opportunity:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update opportunity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !opportunity) {
    return (
      <div className="OpportunityDetails_container">
        <div className="OpportunityDetails_container1">
          <SideNav />
        </div>
        <div className="OpportunityDetails_container2">
          <div className="opportunity-details-container">
            <p>Loading opportunity details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity || !formData) {
    return (
      <div className="OpportunityDetails_container">
        <div className="OpportunityDetails_container1">
          <SideNav />
        </div>
        <div className="OpportunityDetails_container2">
          <div className="opportunity-details-container">
            <p>Unable to load opportunity details.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="OpportunityDetails_container">
      <div className="OpportunityDetails_container1">
        <SideNav />
      </div>
      <div className="OpportunityDetails_container2">
        <div className="opportunity-details-container">
          <h1>Opportunity Details</h1>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {!isEditing ? (
            <div className="detail-view">
              <div>
                <p><strong>Name:</strong> {opportunity.opportunity_name}</p>
                <p><strong>Currency:</strong> {opportunity.currency}</p>
                <p><strong>Amount:</strong> {opportunity.opportunity_amount ? `$${opportunity.opportunity_amount}` : "-"}</p>
                <p><strong>Sales Stage:</strong> {opportunity.sales_stage || "-"}</p>
                <p><strong>Probability:</strong> {opportunity.probability ? `${opportunity.probability}%` : "-"}</p>
                <p><strong>Next Step:</strong> {opportunity.next_step || "-"}</p>
              </div>
              <div>
                <p><strong>Account:</strong> {opportunity.account_name || "-"}</p>
                <p><strong>Expected Close Date:</strong> {opportunity.expected_close_date || "-"}</p>
                <p><strong>Business Type:</strong> {opportunity.business_type || "-"}</p>
                <p><strong>Lead Source:</strong> {opportunity.lead_source || "-"}</p>
                <p><strong>Assigned To:</strong> {opportunity.assigned_to_username || "-"}</p>
              </div>
              <div>
                <p><strong>Created By:</strong> {opportunity.created_by_username || "-"}</p>
                <p><strong>Modified By:</strong> {opportunity.modified_by_username || "-"}</p>
                <p>
                  <strong>Description:</strong><br />
                  {opportunity.description || "No description provided"}
                </p>
              </div>

              <div className="form-buttons">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Opportunity
                </button>
                <button 
                  onClick={() => navigate("/opportunities")}
                  className="btn btn-secondary"
                >
                  Back to Opportunities
                </button>
              </div>
            </div>
          ) : (
            <form className="edit-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="required-field">Name</label>
                <input
                  type="text"
                  name="opportunity_name"
                  value={formData.opportunity_name || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="required-field">Currency</label>
                <select
                  name="currency"
                  value={formData.currency || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Currency</option>
                  {choices.currency?.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="required-field">Amount</label>
                <input
                  type="number"
                  name="opportunity_amount"
                  value={formData.opportunity_amount || ""}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="required-field">Sales Stage</label>
                <select
                  name="sales_stage"
                  value={formData.sales_stage || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Sales Stage</option>
                  {choices.sales_stage?.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Probability (%)</label>
                <input
                  type="number"
                  name="probability"
                  value={formData.probability || ""}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label>Next Step</label>
                <input
                  type="text"
                  name="next_step"
                  value={formData.next_step || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="required-field">Account</label>
                <select
                  name="account"
                  value={formData.account || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Expected Close Date</label>
                <input
                  type="date"
                  name="expected_close_date"
                  value={formData.expected_close_date || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Business Type</label>
                <select
                  name="business_type"
                  value={formData.business_type || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Business Type</option>
                  {choices.business_type?.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Lead Source</label>
                <select
                  name="lead_source"
                  value={formData.lead_source || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Lead Source</option>
                  {choices.lead_source?.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="required-field">Assigned To</label>
                <select
                  name="assigned_to"
                  value={formData.assigned_to || ""}
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

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Enter opportunity description..."
                />
              </div>

              <div className="form-buttons">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
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

export default OpportunityDetails;