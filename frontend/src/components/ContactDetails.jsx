import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ContactDetails = () => {
  const { id } = useParams(); // Get contact ID from URL
  const navigate = useNavigate();
  const [contact, setContact] = useState(null); // State to store contact details
  const [error, setError] = useState(""); // State to store errors
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({}); // State for form data

  // Fetch contact details
  const fetchContactDetails = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/contacts/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setContact(response.data);
      setFormData(response.data); // Initialize form data with contact details
    } catch (err) {
      console.error("Error fetching contact details:", err.response?.data || err.message);
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
      console.error("Error updating contact:", err.response?.data || err.message);
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
    <div style={{ padding: "20px" }}>
      <h1>Contact Details</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isEditing ? (
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
            <input
              type="text"
              name="account_name"
              value={formData.account_name}
              onChange={handleChange}
              disabled
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
            <label>Primary Address:</label>
            <input
              type="text"
              name="primary_address_street"
              value={formData.primary_address_street}
              onChange={handleChange}
            />
            <input
              type="text"
              name="primary_address_city"
              value={formData.primary_address_city}
              onChange={handleChange}
            />
            <input
              type="text"
              name="primary_address_state"
              value={formData.primary_address_state}
              onChange={handleChange}
            />
            <input
              type="text"
              name="primary_address_country"
              value={formData.primary_address_country}
              onChange={handleChange}
            />
            <input
              type="text"
              name="primary_address_postal_code"
              value={formData.primary_address_postal_code}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Alternate Address:</label>
            <input
              type="text"
              name="alternate_address_street"
              value={formData.alternate_address_street}
              onChange={handleChange}
            />
            <input
              type="text"
              name="alternate_address_city"
              value={formData.alternate_address_city}
              onChange={handleChange}
            />
            <input
              type="text"
              name="alternate_address_state"
              value={formData.alternate_address_state}
              onChange={handleChange}
            />
            <input
              type="text"
              name="alternate_address_country"
              value={formData.alternate_address_country}
              onChange={handleChange}
            />
            <input
              type="text"
              name="alternate_address_postal_code"
              value={formData.alternate_address_postal_code}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p><strong>First Name:</strong> {contact.first_name}</p>
          <p><strong>Last Name:</strong> {contact.last_name}</p>
          <p><strong>Job Title:</strong> {contact.job_title}</p>
          <p><strong>Account:</strong> {contact.account_name}</p>
          <p><strong>Email:</strong> {contact.email_address}</p>
          <p><strong>Office Phone:</strong> {contact.office_phone}</p>
          <p><strong>Mobile:</strong> {contact.mobile}</p>
          <p><strong>Department:</strong> {contact.department}</p>
          <p><strong>Primary Address:</strong> {contact.primary_address_street}
          <br />
          {contact.primary_address_city}
          <br />
          {contact.primary_address_state}
          <br />
          {contact.primary_address_country}
          <br />
          {contact.primary_address_postal_code}</p>
          <p><strong>Alternate Address:</strong> {contact.alternate_address_street}
          <br />
          {contact.alternate_address_city}
          <br />
          {contact.alternate_address_state}
          <br />
          {contact.alternate_address_country}
          <br />
          {contact.alternate_address_postal_code}</p>
          <p><strong>Description:</strong> {contact.description}</p>
          <p><strong>Created At:</strong> {contact.created_at}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => navigate("/contacts")}>Back to Contacts</button>
        </div>
      )}
    </div>
  );
};

export default ContactDetails;