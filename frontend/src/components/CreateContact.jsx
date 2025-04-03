import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import './CreateContact.css'; // Import the CSS file for styling

const CreateContact = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    office_phone: "",
    mobile: "",
    email_address: "",
    job_title: "",
    account: "",
    department: "",
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
  });

  const [accounts, setAccounts] = useState([]); // State to store accounts
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  // Fetch accounts and users for the dropdown
  useEffect(() => {
    const fetchAccountsAndUsers = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        // Fetch accounts
        const accountsResponse = await axios.get(
          "http://localhost:8000/api/accounts/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setAccounts(accountsResponse.data); // Set the fetched accounts to state

        // Fetch users
        const usersResponse = await axios.get(
          "http://localhost:8000/api/users/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUsers(usersResponse.data); // Set the fetched users to state
      } catch (err) {
        console.error(
          "Error fetching accounts or users:",
          err.response?.data || err.message
        );
        setError("Failed to fetch accounts or users. Please try again later.");
      }
    };

    fetchAccountsAndUsers();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/contacts/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);

      setSuccess("Contact created successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        office_phone: "",
        mobile: "",
        email_address: "",
        job_title: "",
        account: "",
        department: "",
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
      });
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="CreateContact_container">
      <div className="CreateContact_container1">
        <SideNav />
      </div>
      <div className="CreateContact_container2">
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <h2>Create Contact</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <form onSubmit={handleSubmit}>
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
              <label>Office Phone:</label>
              <input
                type="text"
                name="office_phone"
                value={formData.office_phone}
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
              <label>Email Address:</label>
              <input
                type="email"
                name="email_address"
                value={formData.email_address}
                onChange={handleChange}
                required
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
              <label>Department:</label>
              <input
                type="text"
                name="department"
                value={formData.department}
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
            <div>
              <label>Primary Address:</label>
              <input
                type="text"
                name="primary_address_street"
                value={formData.primary_address_street}
                onChange={handleChange}
                placeholder="Street"
                required
              />
              <input
                type="text"
                name="primary_address_postal_code"
                value={formData.primary_address_postal_code}
                onChange={handleChange}
                placeholder="Postal Code"
                required
              />
              <input
                type="text"
                name="primary_address_city"
                value={formData.primary_address_city}
                onChange={handleChange}
                placeholder="City"
                required
              />
              <input
                type="text"
                name="primary_address_state"
                value={formData.primary_address_state}
                onChange={handleChange}
                placeholder="State"
                required
              />
              <input
                type="text"
                name="primary_address_country"
                value={formData.primary_address_country}
                onChange={handleChange}
                placeholder="Country"
                required
              />
            </div>
            <div>
              <label>Alternate Address:</label>
              <input
                type="text"
                name="alternate_address_street"
                value={formData.alternate_address_street}
                onChange={handleChange}
                placeholder="Street"
              />
              <input
                type="text"
                name="alternate_address_postal_code"
                value={formData.alternate_address_postal_code}
                onChange={handleChange}
                placeholder="Postal Code"
              />
              <input
                type="text"
                name="alternate_address_city"
                value={formData.alternate_address_city}
                onChange={handleChange}
                placeholder="City"
              />
              <input
                type="text"
                name="alternate_address_state"
                value={formData.alternate_address_state}
                onChange={handleChange}
                placeholder="State"
              />
              <input
                type="text"
                name="alternate_address_country"
                value={formData.alternate_address_country}
                onChange={handleChange}
                placeholder="Country"
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
            <button type="button" onClick={() => navigate("/contacts")}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateContact;
