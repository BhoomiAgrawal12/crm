import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import './CreateOpportunity.css'; // Import the CSS file for styling

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
    assigned_to: "", // New field for assigned user
  });
  const [choices, setChoices] = useState({
    sales_stage: [],
    business_type: [],
    lead_source: [],
    currency: [],
  });
  const [accounts, setAccounts] = useState([]); // State to store accounts
  const [users, setUsers] = useState([]); // State to store users
  const [error, setError] = useState("");

  // Fetch choices, accounts, and users from the backend
  useEffect(() => {
    const fetchChoicesAndAccounts = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          setError("You are not authenticated. Please log in.");
          return;
        }

        // Fetch choices
        const choicesResponse = await axios.get(
          "http://localhost:8000/api/opportunity-choices/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setChoices(choicesResponse.data);

        // Fetch accounts
        const accountsResponse = await axios.get(
          "http://localhost:8000/api/accounts/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setAccounts(accountsResponse.data);

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
      } catch (err) {
        console.error(
          "Error fetching data:",
          err.response?.data || err.message
        );
        setError("Failed to fetch data. Please try again.");
      }
    };
    fetchChoicesAndAccounts();
  }, []);

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

      const response = await axios.post(
        "http://localhost:8000/api/opportunities/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201) {
        navigate("/opportunities"); // Redirect to the opportunities page
      }
    } catch (err) {
      console.error(
        "Error creating opportunity:",
        err.response?.data || err.message
      );
      setError("Failed to create opportunity. Please try again.");
    }
  };

  return (
    <div className="CreateOpportunity_container">
      <div className="CreateOpportunity_container1">
        <SideNav />
      </div>
      <div className="CreateOpportunity_container2">
        <div style={{ padding: "20px" }}>
          <h1>Create Opportunity</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Opportunity Name:</label>
              <input
                type="text"
                name="opportunity_name"
                value={formData.opportunity_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Currency:</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                required
              >
                <option value="">Select Currency</option>
                {choices.currency.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Opportunity Amount:</label>
              <input
                type="number"
                name="opportunity_amount"
                value={formData.opportunity_amount}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Sales Stage:</label>
              <select
                name="sales_stage"
                value={formData.sales_stage}
                onChange={handleChange}
                required
              >
                <option value="">Select Sales Stage</option>
                {choices.sales_stage.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Probability:</label>
              <input
                type="number"
                name="probability"
                value={formData.probability}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Next Step:</label>
              <input
                type="text"
                name="next_step"
                value={formData.next_step}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Account:</label>
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
            <div>
              <label>Expected Close Date:</label>
              <input
                type="date"
                name="expected_close_date"
                value={formData.expected_close_date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Business Type:</label>
              <select
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
              >
                <option value="">Select Business Type</option>
                {choices.business_type.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Lead Source:</label>
              <select
                name="lead_source"
                value={formData.lead_source}
                onChange={handleChange}
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
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Create Opportunity</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOpportunity;
