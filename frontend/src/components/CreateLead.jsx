import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    account: "",
    status: "",
    status_description: "",
    lead_source: "",
    lead_source_description: "",
    opportunity_amount: "",
    referred_by: "",
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
  
  const [users, setUsers] = useState([]); // State to store users
  const [error, setError] = useState("");

  // Fetch dropdown options, accounts, and users
  useEffect(() => {
    const fetchChoicesAndAccounts = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          setError("You are not authenticated. Please log in.");
          return;
        }

        // Fetch choices
        const choicesResponse = await axios.get("http://localhost:8000/api/lead-choices/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setChoices(choicesResponse.data);

        
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

    fetchChoicesAndAccounts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("You are not authenticated. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/leads/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201) {
        navigate("/leads"); // Redirect to the leads page
      }
    } catch (err) {
      console.error("Error creating lead:", err.response?.data || err.message);
      setError("Failed to create lead. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Lead</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <select
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
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
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
          <label>Mobile:</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Office Phone:</label>
          <input
            type="text"
            name="office_phone"
            value={formData.office_phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Job Title:</label>
          <input
            type="text"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Account:</label>
          <input
           type="text"
            name="account_name"
            value={formData.account_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Status:</label>
          <select
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
        <div>
          <label>Status Description:</label>
          <textarea
            name="status_description"
            value={formData.status_description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Lead Source:</label>
          <select
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
        <div>
          <label>Lead Source Description:</label>
          <textarea
            name="lead_source_description"
            value={formData.lead_source_description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Opportunity Amount:</label>
          <input
            type="number"
            name="opportunity_amount"
            value={formData.opportunity_amount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Referred By:</label>
          <input
            type="text"
            name="referred_by"
            value={formData.referred_by}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Primary Address:</label>
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
        <div>
          <label>Alternate Address:</label>
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
        <button type="submit">Create Lead</button>
      </form>
    </div>
  );
};

export default CreateLead;