import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SideNav from "./SideNav";
import "./ContactDetails.css";

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContactDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const [contactResponse, accountsResponse, contactsResponse, leadSourceResponse] = await Promise.all([
        axios.get(`http://localhost:8000/api/contacts/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get("http://localhost:8000/api/accounts/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get("http://localhost:8000/api/contacts/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get("http://localhost:8000/api/lead-choices/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      setContact(contactResponse.data);
      setFormData(contactResponse.data);
      setAccounts(accountsResponse.data);
      setContacts(contactsResponse.data);
      setLeadSources(leadSourceResponse.data.lead_source);
    } catch (err) {
      console.error("Error fetching contact details:", err.response?.data || err.message);
      setError("Failed to fetch contact details. Please try again later.");
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
        `http://localhost:8000/api/contacts/${id}/`,
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setContact(response.data);
      setSuccess("Contact updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating contact:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update contact. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContactDetails();
  }, [fetchContactDetails]);

  if (isLoading && !contact) {
    return (
      <div className="ContactDetails_container">
        <div className="ContactDetails_container1">
          <SideNav />
        </div>
        <div className="ContactDetails_container2">
          <div className="contact-details-container">
            <p>Loading contact details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="ContactDetails_container">
        <div className="ContactDetails_container1">
          <SideNav />
        </div>
        <div className="ContactDetails_container2">
          <div className="contact-details-container">
            <p>Unable to load contact details.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ContactDetails_container">
      <div className="ContactDetails_container1">
        <SideNav />
      </div>
      <div className="ContactDetails_container2">
        <div className="contact-details-container">
          <h1>Contact Details</h1>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {isEditing ? (
            <form className="edit-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <select
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                >
                  <option value="">Select a title</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Dr.">Dr.</option>
                </select>
              </div>

              <div className="form-group">
                <label className="required-field">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="required-field">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Account</label>
                <select
                  name="account"
                  value={formData.account || ""}
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

              <div className="form-group">
                <label className="required-field">Email</label>
                <input
                  type="email"
                  name="email_address"
                  value={formData.email_address || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Office Phone</label>
                <input
                  type="tel"
                  name="office_phone"
                  value={formData.office_phone || ""}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit phone number"
                />
              </div>

              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile || ""}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit phone number"
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Lead Source</label>
                <select
                  name="lead_source"
                  value={formData.lead_source || ""}
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
                  value={formData.reports_to || ""}
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

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Enter contact description..."
                />
              </div>

              <div className="form-buttons">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="detail-view">
              <div>
                <p><strong>Title:</strong> {contact.title || "-"}</p>
                <p><strong>First Name:</strong> {contact.first_name}</p>
                <p><strong>Last Name:</strong> {contact.last_name}</p>
                <p><strong>Job Title:</strong> {contact.job_title || "-"}</p>
                <p><strong>Account:</strong> {contact.account_name || "-"}</p>
                <p><strong>Email:</strong> {contact.email_address}</p>
              </div>
              <div>
                <p><strong>Office Phone:</strong> {contact.office_phone || "-"}</p>
                <p><strong>Mobile:</strong> {contact.mobile || "-"}</p>
                <p><strong>Department:</strong> {contact.department || "-"}</p>
                <p><strong>Lead Source:</strong> {contact.lead_source || "-"}</p>
                <p><strong>Reports To:</strong> {contact.reports_to ? `${contact.reports_to.first_name} ${contact.reports_to.last_name}` : "None"}</p>
              </div>
              <div>
                <p><strong>Created By:</strong> {contact.created_by || "-"}</p>
                <p><strong>Modified By:</strong> {contact.modified_by || "-"}</p>
                <p>
                  <strong>Description:</strong><br />
                  {contact.description || "No description provided"}
                </p>
              </div>

              <div className="form-buttons">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Contact
                </button>
                <button 
                  onClick={() => navigate("/contacts")}
                  className="btn btn-secondary"
                >
                  Back to Contacts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;