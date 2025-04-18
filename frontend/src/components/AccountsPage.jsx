import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import "./AccountPage.css";

const AccountsPage = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        setError("You are not authenticated. Please log in.");
        setIsLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:8000/api/accounts/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setAccounts(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching accounts:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch accounts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(account => 
    account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.billing_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.billing_country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.office_phone?.includes(searchTerm) ||
    account.email_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="account-container">
      <div className="account-header">
        <SideNav />
      </div>
      <div className="account-content">
        <div className="account-card">
          <div className="page-header">
            <h1 className="page-title">Accounts</h1>
            <div className="button-group">
              <button 
                className="button button-success"
                onClick={() => navigate("/create-account")}
                aria-label="Create new account"
              >
                <span>+</span> Create Account
              </button>
            </div>
          </div>

          {error && (
            <div className="status-message error-message">
              {error}
            </div>
          )}

          <div className="search-container" style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search accounts..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', maxWidth: '400px' }}
            />
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <span>Loading accounts...</span>
            </div>
          ) : filteredAccounts.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>City</th>
                    <th>Country</th>
                    <th>Phone</th>
                    <th>Assigned To</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr key={account.id}>
                      <td>
                        <button
                          onClick={() => navigate(`/account-details/${account.id}`)}
                          className="table-link"
                          aria-label={`View details for ${account.name}`}
                        >
                          {account.name || '-'}
                        </button>
                      </td>
                      <td>{account.billing_city || '-'}</td>
                      <td>{account.billing_country || '-'}</td>
                      <td>{account.office_phone || '-'}</td>
                      <td>
                        {account.assigned_to_username ? (
                          <button
                            onClick={() => navigate(`/user-details/${account.assigned_to_username}`)}
                            className="table-link"
                            aria-label={`View user ${account.assigned_to_username}`}
                          >
                            {account.assigned_to_username}
                          </button>
                        ) : '-'}
                      </td>
                      <td>
                        {account.email_address ? (
                          <a href={`mailto:${account.email_address}`} className="table-link">
                            {account.email_address}
                          </a>
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
                <p>No accounts match your search criteria.</p>
              ) : (
                <p>No accounts found. Create your first account to get started.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;