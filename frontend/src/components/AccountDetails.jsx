import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SideNav from "./SideNav";
import "./AccountDetails.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const AccountDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [accountTypes, setAccountTypes] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccountDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const [accountResponse, choicesResponse, accountsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/accounts/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get(`${API_BASE_URL}/api/account/choices/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get(`${API_BASE_URL}/api/accounts/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      const accountData = accountResponse.data;
      accountData.member_of = accountData.member_of?.id || "";
      setAccount(accountData);
      setFormData(accountData);

      setAccountTypes(choicesResponse.data.account_type || []);
      setIndustries(choicesResponse.data.industry || []);
      setAccounts(accountsResponse.data);
    } catch (err) {
      console.error("Error fetching account details:", err.response?.data || err.message);
      setError("Failed to fetch account details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

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
        `${API_BASE_URL}/api/accounts/${id}/`,
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setAccount(response.data);
      setSuccess("Account updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating account:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update account. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [fetchAccountDetails]);

  if (isLoading && !account) {
    return <div className="loading-message">Loading account details...</div>;
  }

  if (!account) {
    return <div className="error-message">Unable to load account details.</div>;
  }

  const AddressSection = ({ prefix, data }) => (
    <div className="address-section">
      <h3>{prefix} Address</h3>
      <div className="address-inputs">
        <div className="account-form-group">
          <label>Street</label>
          <input type="text" name={`${prefix}_street`} value={data[`${prefix}_street`] || ""} onChange={handleChange} />
        </div>
        <div className="account-form-group">

          <label>City</label>
          <input type="text" name={`${prefix}_city`} value={data[`${prefix}_city`] || ""} onChange={handleChange} />
        </div>
       <div className="account-form-group">

          <label>State</label>
          <input type="text" name={`${prefix}_state`} value={data[`${prefix}_state`] || ""} onChange={handleChange} />
        </div>
        <div className="account-form-group">

          <label>Country</label>
          <input type="text" name={`${prefix}_country`} value={data[`${prefix}_country`] || ""} onChange={handleChange} />
        </div>
        <div className="account-form-group">

          <label>Postal Code</label>
          <input type="text" name={`${prefix}_postal_code`} value={data[`${prefix}_postal_code`] || ""} onChange={handleChange} />
        </div>
      </div>
    </div>
  );

  const AccountDetailView = ({ account }) => (
    <div className="detail-view">
      <div>
        <p><strong>Name:</strong> {account.name}</p>
        <p><strong>Assigned To:</strong> {account.assigned_to_username || "Unassigned"}</p>
        <p><strong>Website:</strong> {account.website || "-"}</p>
        <p><strong>Phone:</strong> {account.office_phone || "-"}</p>
        <p><strong>Email:</strong> {account.email_address || "-"}</p>
        <p><strong>Account Type:</strong> {account.account_type || "-"}</p>
        <p><strong>Industry:</strong> {account.industry || "-"}</p>
      </div>
      <div>
        <p><strong>Annual Revenue:</strong> {account.annual_revenue ? `$${account.annual_revenue}` : "-"}</p>
        <p><strong>Employees:</strong> {account.employees || "-"}</p>
        <p><strong>Parent Account:</strong> {account.member_of?.name || "None"}</p>
        <p><strong>Billing Address:</strong><br />
          {account.billing_street || "-"}<br />
          {account.billing_city || ""} {account.billing_state || ""}<br />
          {account.billing_country || ""} {account.billing_postal_code || ""}</p>
      </div>
      <div>
        <p><strong>Shipping Address:</strong><br />
          {account.shipping_street || "-"}<br />
          {account.shipping_city || ""} {account.shipping_state || ""}<br />
          {account.shipping_country || ""} {account.shipping_postal_code || ""}</p>
        <p><strong>Description:</strong><br />{account.description || "No description provided"}</p>
      </div>
    </div>
  );

  return (
    <div className="AccountDetails_container">
      <div className="AccountDetails_container1">
        <SideNav />
      </div>
      <div className="AccountDetails_container2">
        <div className="account-details-container">
          <h1>Account Details</h1>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {isEditing ? (
            <form className="edit-form" onSubmit={handleSubmit}>
             <div className="account-form-group">
                <label className="required-field">Name</label>
                <input type="text" name="name" value={formData.name || ""} onChange={handleChange} required />
              </div>

              <div className="account-form-group">
                <label>Assigned To</label>
                <input type="text" name="assigned_to_username" value={formData.assigned_to_username ?? "Unassigned"} disabled />
              </div>

              <div className="account-form-group">
                <label>Website</label>
                <input type="url" name="website" value={formData.website || ""} onChange={handleChange} placeholder="https://example.com" />
              </div>

             <div className="account-form-group">
                <label className="required-field">Phone</label>
                <input type="text" name="office_phone" value={formData.office_phone || ""} onChange={handleChange} required />
              </div>

              <div className="account-form-group">

                <label className="required-field">Email</label>
                <input type="email" name="email_address" value={formData.email_address || ""} onChange={handleChange} required />
              </div>

             <div className="account-form-group">
                <label>Account Type</label>
                <select name="account_type" value={formData.account_type || ""} onChange={handleChange}>
                  <option value="">Select an account type</option>
                  {accountTypes.map((type) => (
                    <option key={type[0]} value={type[0]}>{type[1]}</option>
                  ))}
                </select>
              </div>

              <div className="account-form-group">
                <label>Industry</label>
                <select name="industry" value={formData.industry || ""} onChange={handleChange}>
                  <option value="">Select an industry</option>
                  {industries.map((industry) => (
                    <option key={industry[0]} value={industry[0]}>{industry[1]}</option>
                  ))}
                </select>
              </div>

              <div className="account-form-group">
                <label>Annual Revenue</label>
                <input type="number" name="annual_revenue" value={formData.annual_revenue || ""} onChange={handleChange} min="0" step="0.01" />
              </div>

              <div className="account-form-group">
                <label>Employees</label>
                <input type="number" name="employees" value={formData.employees || ""} onChange={handleChange} min="0" />
              </div>

              <div className="account-form-group">
                <label>Parent Account</label>
                <select name="member_of" value={formData.member_of || ""} onChange={handleChange}>
                  <option value="">Select a parent account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>

              <AddressSection prefix="billing" data={formData} />
              <AddressSection prefix="shipping" data={formData} />

              <div className="account-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <textarea 
                  name="description" 
                  value={formData.description || ""} 
                  onChange={handleChange}
                  placeholder="Enter account description..."
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(account);
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <AccountDetailView account={account} />
              <div className="form-buttons">
                <button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit Account</button>
                <button onClick={() => navigate("/accounts")} className="btn btn-secondary">Back to Accounts</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;