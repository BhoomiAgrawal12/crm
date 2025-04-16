import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import "./LeadsPage.css";

const LeadsPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        setError("You are not authenticated. Please log in.");
        setIsLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:8000/api/leads/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setLeads(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching leads:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch leads. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const searchLower = searchTerm.toLowerCase();
    return (
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchLower) ||
      lead.status?.toLowerCase().includes(searchLower) ||
      lead.account_name?.toLowerCase().includes(searchLower) ||
      lead.office_phone?.includes(searchTerm) ||
      lead.email_address?.toLowerCase().includes(searchLower) ||
      lead.assigned_to_username?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusClass = (status) => {
    if (!status) return '';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('new')) return 'status-new';
    if (statusLower.includes('qualif')) return 'status-qualified';
    if (statusLower.includes('contact')) return 'status-contacted';
    if (statusLower.includes('lost')) return 'status-lost';
    if (statusLower.includes('convert')) return 'status-converted';
    return '';
  };

  return (
    <div className="leads-container">
      <div className="leads-header">
        <SideNav />
      </div>
      <div className="leads-content">
        <div className="leads-card">
          <div className="page-header">
            <h1 className="page-title">Leads</h1>
            <div className="button-group">
              <button
                className="button button-success"
                onClick={() => navigate("/create-lead")}
                aria-label="Create new lead"
              >
                <span>+</span> Create Lead
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
              placeholder="Search leads..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <span>Loading leads...</span>
            </div>
          ) : filteredLeads.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Account</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <button
                          onClick={() => navigate(`/lead-details/${lead.id}`)}
                          className="table-link"
                          aria-label={`View details for ${lead.first_name} ${lead.last_name}`}
                        >
                          {lead.title} {lead.first_name} {lead.last_name}
                        </button>
                      </td>
                      <td>
                        {lead.status && (
                          <span className={`status-badge ${getStatusClass(lead.status)}`}>
                            {lead.status}
                          </span>
                        )}
                      </td>
                      <td>
                        {lead.account_name ? (
                          <button
                            onClick={() => navigate(`/account-details/${lead.account}`)}
                            className="table-link"
                            aria-label={`View account ${lead.account_name}`}
                          >
                            {lead.account_name}
                          </button>
                        ) : '-'}
                      </td>
                      <td>{lead.office_phone || '-'}</td>
                      <td>
                        {lead.email_address ? (
                          <a href={`mailto:${lead.email_address}`} className="table-link">
                            {lead.email_address}
                          </a>
                        ) : '-'}
                      </td>
                      <td>
                        {lead.assigned_to_username ? (
                          <button
                            onClick={() => navigate(`/user-details/${lead.assigned_to_username}`)}
                            className="table-link"
                            aria-label={`View user ${lead.assigned_to_username}`}
                          >
                            {lead.assigned_to_username}
                          </button>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              {searchTerm ? (
                <p>No leads match your search criteria.</p>
              ) : (
                <p>No leads found. Create your first lead to get started.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;