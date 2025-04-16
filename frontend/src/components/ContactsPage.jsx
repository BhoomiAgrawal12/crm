import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import "./ContactsPage.css";

const ContactsPage = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        setError("You are not authenticated. Please log in.");
        setIsLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:8000/api/contacts/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setContacts(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching contacts:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch contacts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.first_name?.toLowerCase().includes(searchLower) ||
      contact.last_name?.toLowerCase().includes(searchLower) ||
      contact.job_title?.toLowerCase().includes(searchLower) ||
      contact.account_name?.toLowerCase().includes(searchLower) ||
      contact.email_address?.toLowerCase().includes(searchLower) ||
      contact.office_phone?.includes(searchTerm) ||
      contact.assigned_to_username?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <SideNav />
      </div>
      <div className="contacts-content">
        <div className="contacts-card">
          <div className="page-header">
            <h1 className="page-title">Contacts</h1>
            <div className="button-group">
              <button
                className="button button-success"
                onClick={() => navigate('/create-contact')}
                aria-label="Create new contact"
              >
                <span>+</span> Create Contact
              </button>
            </div>
          </div>

          {error && (
            <div className="status-message error-message">
              {error}
            </div>
          )}

          <div className="search-container">
            <input
              type="text"
              placeholder="Search contacts..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <span>Loading contacts...</span>
            </div>
          ) : filteredContacts.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Job Title</th>
                    <th>Account</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Assigned To</th>
                    <th>Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>
                        <button
                          onClick={() => navigate(`/contact-details/${contact.id}`)}
                          className="table-link"
                          aria-label={`View details for ${contact.first_name} ${contact.last_name}`}
                        >
                          {contact.first_name} {contact.last_name}
                        </button>
                      </td>
                      <td>{contact.job_title || '-'}</td>
                      <td>
                        {contact.account_name ? (
                          <button
                            onClick={() => navigate(`/account-details/${contact.account_id}`)}
                            className="table-link"
                            aria-label={`View account ${contact.account_name}`}
                          >
                            {contact.account_name}
                          </button>
                        ) : '-'}
                      </td>
                      <td>
                        {contact.email_address ? (
                          <a href={`mailto:${contact.email_address}`} className="table-link">
                            {contact.email_address}
                          </a>
                        ) : '-'}
                      </td>
                      <td>{contact.office_phone || '-'}</td>
                      <td>
                        {contact.assigned_to_username ? (
                          <button
                            onClick={() => navigate(`/user-details/${contact.assigned_to_username}`)}
                            className="table-link"
                            aria-label={`View user ${contact.assigned_to_username}`}
                          >
                            {contact.assigned_to_username}
                          </button>
                        ) : '-'}
                      </td>
                      <td>{formatDate(contact.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              {searchTerm ? (
                <p>No contacts match your search criteria.</p>
              ) : (
                <p>No contacts found. Create your first contact to get started.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;