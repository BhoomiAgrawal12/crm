import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import "./CreateOpportunity.css";

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    opportunity_name: "",
    currency: "",
    opportunity_amount: "",
    sales_stage: "",
    probability: "",
    next_step: "",
    account: "",
    expected_close_date: "",
    business_type: "",
    lead_source: "",
    description: "",
    assigned_to: "",
  });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const [choicesResponse, accountsResponse, usersResponse] = await Promise.all([
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

        setChoices(choicesResponse.data);
        setAccounts(accountsResponse.data);
        setUsers(usersResponse.data);
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
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/opportunities/",
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.status === 201) {
        setSuccess("Opportunity created successfully! Redirecting...");
        setTimeout(() => navigate("/opportunities"), 1500);
      }
    } catch (err) {
      console.error("Error creating opportunity:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create opportunity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="CreateOpportunity_container">
      <div className="CreateOpportunity_container1">
        <SideNav />
      </div>
      <div className="CreateOpportunity_container2">
        <div className="opportunity-form">
          <h1>Create Opportunity</h1>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Opportunity Name *</label>
                <input
                  type="text"
                  name="opportunity_name"
                  value={formData.opportunity_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Currency *</label>
                <select
                  name="currency"
                  value={formData.currency}
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Opportunity Amount *</label>
                <input
                  type="number"
                  name="opportunity_amount"
                  value={formData.opportunity_amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Sales Stage *</label>
                <select
                  name="sales_stage"
                  value={formData.sales_stage}
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

            <div className="form-row">
              <div className="form-group">
                <label>Probability (%)</label>
                <input
                  type="number"
                  name="probability"
                  value={formData.probability}
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
                  value={formData.next_step}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Account *</label>
                <select
                  name="account"
                  value={formData.account}
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
                <label>Assigned To *</label>
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

            <div className="form-row">
              <div className="form-group">
                <label>Expected Close Date *</label>
                <input
                  type="date"
                  name="expected_close_date"
                  value={formData.expected_close_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Business Type</label>
                <select
                  name="business_type"
                  value={formData.business_type}
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
            </div>

            <div className="form-group">
              <label>Lead Source</label>
              <select
                name="lead_source"
                value={formData.lead_source}
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
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter opportunity details..."
              />
            </div>

            <div className="form-buttons">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Opportunity"}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate("/opportunities")}
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

export default CreateOpportunity;