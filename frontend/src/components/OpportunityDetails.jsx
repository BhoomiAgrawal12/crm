import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const OpportunityDetails = () => {
  const { id } = useParams(); // Get the opportunity ID from the URL
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null); // State to store opportunity details
  const [formData, setFormData] = useState(null); // State for editing opportunity
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit mode
  const [choices, setChoices] = useState({
    sales_stage: [],
    business_type: [],
    lead_source: [],
    currency: [],
  }); // State for dropdown options
  const [accounts, setAccounts] = useState([]); // State for accounts
  const [users, setUsers] = useState([]); // State for users
  const [error, setError] = useState("");

  // Fetch opportunity details and dropdown options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          setError("You are not authenticated. Please log in.");
          return;
        }

        // Fetch opportunity details
        const opportunityResponse = await axios.get(`http://localhost:8000/api/opportunity/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setOpportunity(opportunityResponse.data);
        setFormData(opportunityResponse.data); // Initialize form data for editing

        // Fetch dropdown options
        const choicesResponse = await axios.get("http://localhost:8000/api/opportunity-choices/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setChoices(choicesResponse.data);

        // Fetch accounts
        const accountsResponse = await axios.get("http://localhost:8000/api/accounts/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAccounts(accountsResponse.data);

        // Fetch users
        const usersResponse = await axios.get("http://localhost:8000/api/users/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(usersResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
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
        `http://localhost:8000/api/opportunity/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setOpportunity(response.data); // Update opportunity details
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error("Error updating opportunity:", err.response?.data || err.message);
      setError("Failed to update opportunity. Please try again.");
    }
  };

  if (!opportunity || !formData) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Opportunity Details</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!isEditing ? (
        <div>
          <p><strong>Name:</strong> {opportunity.opportunity_name}</p>
          <p><strong>Currency:</strong> {opportunity.currency}</p>
          <p><strong>Amount:</strong> {opportunity.opportunity_amount}</p>
          <p><strong>Sales Stage:</strong> {opportunity.sales_stage}</p>
          <p><strong>Probability:</strong> {opportunity.probability}</p>
          <p><strong>Next Step:</strong> {opportunity.next_step}</p>
          <p><strong>Account:</strong> {opportunity.account_name}</p>
          <p><strong>Expected Close Date:</strong> {opportunity.expected_close_date}</p>
          <p><strong>Business Type:</strong> {opportunity.business_type}</p>
          <p><strong>Lead Source:</strong> {opportunity.lead_source}</p>
          <p><strong>Description:</strong> {opportunity.description}</p>
          <p><strong>Assigned To:</strong> {opportunity.assigned_to_username}</p>
          <button onClick={() => setIsEditing(true)}>Edit Opportunity</button>
          <button onClick={() => navigate("/opportunities")} style={{ marginLeft: "10px" }}>
            Back to Opportunities
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
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
            <label>Amount:</label>
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
          <button onClick={() => setIsEditing(false)} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default OpportunityDetails;