import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]); // State to store contacts
  const [error, setError] = useState(""); // State to store errors
  const navigate = useNavigate();

  // Function to fetch contacts
  const fetchContacts = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("You are not authenticated. Please log in.");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/contacts/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setContacts(response.data); // Set the fetched contacts to state
    } catch (err) {
      console.error("Error fetching contacts:", err.response?.data || err.message);
      setError("Failed to fetch contacts. Please try again later.");
    }
  };

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Contacts</h1>
      <button
        onClick={() => navigate('/create-contact')}
      >
        Create Contact
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {contacts.length > 0 ? (
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Job Title</th>
              <th>Account Name</th>
              <th>Email</th>
              <th>Office Phone</th>
              <th>User</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.first_name} {contact.last_name}</td>
                <td>{contact.job_title}</td>
                <td>{contact.account_name}</td>
                <td>{contact.email_address}</td>
                <td>{contact.office_phone}</td>
                <td>{contact.assigned_to_username}</td>
                <td>{contact.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No contacts found.</p>
      )}
    </div>
  );
};

export default ContactsPage;