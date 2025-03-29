import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AccountsPage = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]); // State to store accounts
  const [error, setError] = useState(""); // State to store errors

  // Function to fetch accounts
  const fetchAccounts = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("You are not authenticated. Please log in.");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/accounts/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setAccounts(response.data); // Set the fetched accounts to state
    } catch (err) {
      console.error("Error fetching accounts:", err.response?.data || err.message);
      setError("Failed to fetch accounts. Please try again later.");
    }
  };

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Accounts</h1>
      <button
        onClick={() => navigate('/create-account')}
      >
        Create Account
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {accounts.length > 0 ? (
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Billing Country</th>
              <th>Phone</th>
              <th>User</th>
              <th>Email Address</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.name}</td>
                <td>{account.billing_city}</td>
                <td>{account.billing_country}</td>
                <td>{account.office_phone}</td>
                <td>{account.assigned_to_username}</td> {/* Display the username */}
                <td>{account.email_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No accounts found.</p>
      )}
    </div>
  );
};

export default AccountsPage;