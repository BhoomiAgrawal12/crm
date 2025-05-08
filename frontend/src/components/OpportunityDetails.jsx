import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import "./OpportunityDetails.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const OpportunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [formData, setFormData] = useState({});
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
        axios.get(`${API_BASE_URL}/api/opportunity/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get(`${API_BASE_URL}/api/opportunity-choices/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get(`${API_BASE_URL}/api/accounts/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get(`${API_BASE_URL}/api/users/`, {
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
        `${API_BASE_URL}/api/opportunity/${id}/`,
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

  const renderDetail = (label, value, isCurrency = false) => (
    <div className="detail-section">
      <div className="detail-label">{label}</div>
      <div className={`detail-value ${!value ? 'empty' : ''}`}>
        {isCurrency && value ? `$${value}` : value || 'Not specified'}
      </div>
    </div>
  );

  if (isLoading && !opportunity) {
    return (
      <div className="OpportunityDetails_container">
        <div className="OpportunityDetails_container1">
          <SideNav />
        </div>
        <div className="OpportunityDetails_container2">
          <div className="loading-message">
            <div className="spinner"></div>
            Loading opportunity details...
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
          <div className="error-message">
            Failed to load opportunity details. Please try again.
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
        <div className="opportunity-details-card">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="opportunity-header">
            <h1 className="opportunity-title">
              {isEditing ? "Edit Opportunity" : opportunity.opportunity_name}
            </h1>
            <div className="button-group">
              {!isEditing ? (
                <>
                  <button
                    className="button button-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Opportunity
                  </button>
                  <button
                    className="button button-secondary"
                    onClick={() => navigate("/opportunities")}
                  >
                    Back to Opportunities
                  </button>
                </>
              ) : (
                <button
                  className="button button-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(opportunity);
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
                {renderDetail("Name", opportunity.opportunity_name)}
                {renderDetail("Currency", opportunity.currency)}
                {renderDetail("Amount", opportunity.opportunity_amount, true)}
                {renderDetail("Sales Stage", opportunity.sales_stage)}
                {renderDetail("Probability", opportunity.probability ? `${opportunity.probability}%` : null)}
                {renderDetail("Next Step", opportunity.next_step)}
              </div>
              <div>
                {renderDetail("Account", opportunity.account_name)}
                {renderDetail("Expected Close Date", opportunity.expected_close_date)}
                {renderDetail("Business Type", opportunity.business_type)}
                {renderDetail("Lead Source", opportunity.lead_source)}
                {renderDetail("Assigned To", opportunity.assigned_to_username)}
              </div>
              <div className="full-width-section">
                {renderDetail("Description", opportunity.description)}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              <div>
                <div className="opportunity-form-group">
                  <label className="required">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="opportunity_name"
                    value={formData.opportunity_name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="opportunity-form-group">
                  <label className="required">Currency</label>
                  <select
                    className="form-control"
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

                <div className="opportunity-form-group">
                  <label className="required">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="opportunity_amount"
                    value={formData.opportunity_amount || ""}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="opportunity-form-group">
                  <label className="required">Sales Stage</label>
                  <select
                    className="form-control"
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
              </div>

              <div>
                <div className="opportunity-form-group">
                  <label>Probability (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="probability"
                    value={formData.probability || ""}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="opportunity-form-group">
                  <label>Next Step</label>
                  <input
                    type="text"
                    className="form-control"
                    name="next_step"
                    value={formData.next_step || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="opportunity-form-group">
                  <label className="required">Account</label>
                  <select
                    className="form-control"
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

                <div className="opportunity-form-group">
                  <label>Expected Close Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="expected_close_date"
                    value={formData.expected_close_date || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="full-width-section">
                <div className="opportunity-form-group">
                  <label>Business Type</label>
                  <select
                    className="form-control"
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

                <div className="opportunity-form-group">
                  <label>Lead Source</label>
                  <select
                    className="form-control"
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

                <div className="opportunity-form-group">
                  <label className="required">Assigned To</label>
                  <select
                    className="form-control"
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

                <div className="opportunity-form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    placeholder="Enter opportunity description..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(opportunity);
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

export default OpportunityDetails;