import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import "./CreateContact.css";

const CreateContact = () => {
  const [formData, setFormData] = useState({
    title: "",
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
    lead_source: "",
    reports_to: "",
    assigned_to: "",
  });

  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const [accountsResponse, usersResponse, leadSourceResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/accounts/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("http://localhost:8000/api/users/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("http://localhost:8000/api/lead-choices/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        setAccounts(accountsResponse.data);
        setUsers(usersResponse.data);
        setLeadSources(leadSourceResponse.data.lead_source);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
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
    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:8000/api/contacts/",
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setSuccess("Contact created successfully!");
      // Reset form except for dropdown options that need to be preserved
      setFormData({
        ...formData,
        title: "",
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
        lead_source: "",
        reports_to: "",
        assigned_to: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="CreateContact_container">
      <div className="CreateContact_container1">
        <SideNav />
      </div>
      <div className="CreateContact_container2">
        <div className="contact-form">
          <h2>Create Contact</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select a title</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Dr.">Dr.</option>
              </select>
            </div>

            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Office Phone *</label>
              <input
                type="tel"
                name="office_phone"
                value={formData.office_phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Mobile</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email_address"
                value={formData.email_address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
              />
            </div>

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
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Lead Source</label>
              <select
                name="lead_source"
                value={formData.lead_source}
                onChange={handleChange}
              >
                <option value="">Select a lead source</option>
                {leadSources.map((source) => (
                  <option key={source[0]} value={source[0]}>
                    {source[1]}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Reports To</label>
              <select
                name="reports_to"
                value={formData.reports_to}
                onChange={handleChange}
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

            <div className="address-group">
              <label>Primary Address *</label>
              <div className="address-inputs">
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
            </div>

            <div className="address-group">
              <label>Alternate Address</label>
              <div className="address-inputs">
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
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate("/contacts")}
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

export default CreateContact;