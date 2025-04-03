import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SideNav from "./SideNav";
import "./ContactDetails.css"; // Import CSS for styling

const ContactDetails = () => {
  const { id } = useParams(); // Get contact ID from URL
  const navigate = useNavigate();
  const [contact, setContact] = useState(null); // State to store contact details
  const [error, setError] = useState(""); // State to store errors
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({}); // State for form data
  const [accounts, setAccounts] = useState([]); // State for accounts dropdown
  const [contacts, setContacts] = useState([]); // State for reports_to dropdown
  const [leadSources, setLeadSources] = useState([]); // State for lead source dropdown

  // Fetch contact details
  const fetchContactDetails = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      // Fetch contact details
      const response = await axios.get(
        `http://localhost:8000/api/contacts/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setContact(response.data);
      setFormData(response.data); // Initialize form data with contact details

      // Fetch accounts for the account dropdown
      const accountsResponse = await axios.get(
        "http://localhost:8000/api/accounts/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAccounts(accountsResponse.data);

      // Fetch contacts for the reports_to dropdown
      const contactsResponse = await axios.get(
        "http://localhost:8000/api/contacts/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setContacts(contactsResponse.data);

      // Fetch lead source choices
      const leadSourceResponse = await axios.get(
        "http://localhost:8000/api/lead-choices/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setLeadSources(leadSourceResponse.data.lead_source);
    } catch (err) {
      console.error(
        "Error fetching contact details:",
        err.response?.data || err.message
      );
      setError("Failed to fetch contact details. Please try again later.");
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
        `http://localhost:8000/api/contacts/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setContact(response.data); // Update contact details
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error(
        "Error updating contact:",
        err.response?.data || err.message
      );
      setError("Failed to update contact. Please try again later.");
    }
  };

  useEffect(() => {
    fetchContactDetails();
  }, [fetchContactDetails]);

  if (!contact) {
    return <p>Loading...</p>;
  }

  return (
    <div className="ContactDetails_container">
      <div className="ContactDetails_container1">
        <SideNav />
      </div>
      <div className="ContactDetails_container2">
        <div style={{ padding: "20px" }}>
          <h1>Contact Details</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div>
                <label>Title:</label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                >
                  <option value="">Select a title</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Dr.">Dr.</option>
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
                <label>Office Phone:</label>
                <input
                  type="text"
                  name="office_phone"
                  value={formData.office_phone}
                  onChange={handleChange}
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
                <label>Department:</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Lead Source:</label>
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
              <div>
                <label>Reports To:</label>
                <select
                  name="reports_to"
                  value={formData.reports_to}
                  onChange={handleChange}
                >
                  <option value="">Select a contact</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.first_name} {contact.last_name}
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
                <strong>Title:</strong> {contact.title}
              </p>
              <p>
                <strong>First Name:</strong> {contact.first_name}
              </p>
              <p>
                <strong>Last Name:</strong> {contact.last_name}
              </p>
              <p>
                <strong>Job Title:</strong> {contact.job_title}
              </p>
              <p>
                <strong>Account:</strong> {contact.account_name}
              </p>
              <p>
                <strong>Email:</strong> {contact.email_address}
              </p>
              <p>
                <strong>Office Phone:</strong> {contact.office_phone}
              </p>
              <p>
                <strong>Mobile:</strong> {contact.mobile}
              </p>
              <p>
                <strong>Department:</strong> {contact.department}
              </p>
              <p>
                <strong>Lead Source:</strong> {contact.lead_source}
              </p>
              <p>
                <strong>Reports To:</strong>{" "}
                {contact.reports_to ? `${contact.reports_to.first_name} ${contact.reports_to.last_name}` : "None"}
              </p>
              <p>
                <strong>Description:</strong> {contact.description}
              </p>
              <p>
                <strong>Created By:</strong> {contact.created_by}
              </p>
              <p>
                <strong>Modified By:</strong> {contact.modified_by}
              </p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => navigate("/contacts")}>
                Back to Contacts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
