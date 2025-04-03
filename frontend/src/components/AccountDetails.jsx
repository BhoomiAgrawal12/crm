import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SideNav from "./SideNav";
import "./AccountDetails.css"; // Import CSS for styling

const AccountDetails = () => {
  const { id } = useParams(); // Get account ID from URL
  const navigate = useNavigate();
  const [account, setAccount] = useState(null); // State to store account details
  const [error, setError] = useState(""); // State to store errors
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({}); // State for form data
  const [accountTypes, setAccountTypes] = useState([]); // State for account type choices
  const [industries, setIndustries] = useState([]); // State for industry choices
  const [accounts, setAccounts] = useState([]); // State for parent accounts

  // Fetch account details
  const fetchAccountDetails = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      // Fetch account details
      const response = await axios.get(
        `http://localhost:8000/api/accounts/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setAccount(response.data);
      setFormData(response.data); // Initialize form data with account details

      // Fetch account choices (account_type and industry)
      const choicesResponse = await axios.get(
        "http://localhost:8000/api/account/choices/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAccountTypes(choicesResponse.data.account_type);
      setIndustries(choicesResponse.data.industry);

      // Fetch all accounts for the "member_of" dropdown
      const accountsResponse = await axios.get(
        "http://localhost:8000/api/accounts/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAccounts(accountsResponse.data);
    } catch (err) {
      console.error(
        "Error fetching account details:",
        err.response?.data || err.message
      );
      setError("Failed to fetch account details. Please try again later.");
    }
  }, [id, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for editing
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.put(
        `http://localhost:8000/api/accounts/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setAccount(response.data); // Update account details
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error(
        "Error updating account:",
        err.response?.data || err.message
      );
      setError("Failed to update account. Please try again later.");
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [fetchAccountDetails]);

  if (!account) {
    return <p>Loading...</p>;
  }

  return (
    <div className="AccountDetails_container">
      <div className="AccountDetails_container1">
        <SideNav />
      </div>
      <div className="AccountDetails_container2">
        <div style={{ padding: "20px" }}>
          <h1>Account Details</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Assigned To:</label>
                <input
                  type="text"
                  name="assigned_to_username"
                  value={formData.assigned_to_username || "Unassigned"}
                  disabled
                />
              </div>
              <div>
                <label>Website:</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Phone:</label>
                <input
                  type="text"
                  name="office_phone"
                  value={formData.office_phone}
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
                <label>Account Type:</label>
                <select
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleChange}
                >
                  <option value="">Select an account type</option>
                  {accountTypes.map((type) => (
                    <option key={type[0]} value={type[0]}>
                      {type[1]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Industry:</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  <option value="">Select an industry</option>
                  {industries.map((industry) => (
                    <option key={industry[0]} value={industry[0]}>
                      {industry[1]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Annual Revenue:</label>
                <input
                  type="number"
                  name="annual_revenue"
                  value={formData.annual_revenue}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Employees:</label>
                <input
                  type="number"
                  name="employees"
                  value={formData.employees}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Parent Account:</label>
                <select
                  name="member_of"
                  value={formData.member_of || ""}
                  onChange={handleChange}
                >
                  <option value="">Select a parent account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Billing Address:</label>
                <input
                  type="text"
                  name="billing_street"
                  value={formData.billing_street}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="billing_city"
                  value={formData.billing_city}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="billing_state"
                  value={formData.billing_state}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="billing_country"
                  value={formData.billing_country}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="billing_postal_code"
                  value={formData.billing_postal_code}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Shipping Address:</label>
                <input
                  type="text"
                  name="shipping_street"
                  value={formData.shipping_street}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="shipping_city"
                  value={formData.shipping_city}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="shipping_state"
                  value={formData.shipping_state}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="shipping_country"
                  value={formData.shipping_country}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="shipping_postal_code"
                  value={formData.shipping_postal_code}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p>
                <strong>Name:</strong> {account.name}
              </p>
              <p>
                <strong>Assigned To:</strong>{" "}
                {account.assigned_to_username || "Unassigned"}
              </p>
              <p>
                <strong>Website:</strong> {account.website}
              </p>
              <p>
                <strong>Phone:</strong> {account.office_phone}
              </p>
              <p>
                <strong>Email:</strong> {account.email_address}
              </p>
              <p>
                <strong>Account Type:</strong> {account.account_type}
              </p>
              <p>
                <strong>Industry:</strong> {account.industry}
              </p>
              <p>
                <strong>Annual Revenue:</strong> {account.annual_revenue}
              </p>
              <p>
                <strong>Employees:</strong> {account.employees}
              </p>
              <p>
                <strong>Parent Account:</strong>{" "}
                {account.member_of ? account.member_of.name : "None"}
              </p>
              <p>
                <strong>Billing Address:</strong> {account.billing_street}
                <br />
                {account.billing_city}
                <br />
                {account.billing_state}
                <br />
                {account.billing_country}
                <br />
                {account.billing_postal_code}
              </p>
              <p>
                <strong>Shipping Address:</strong> {account.shipping_street}
                <br />
                {account.shipping_city}
                <br />
                {account.shipping_state}
                <br />
                {account.shipping_country}
                <br />
                {account.shipping_postal_code}
              </p>
              <p>
                <strong>Description:</strong> {account.description}
              </p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => navigate("/accounts")}>
                Back to Accounts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
