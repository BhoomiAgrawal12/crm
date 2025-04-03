import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AccountPage.css"; // Importing the CSS file for styling
import SideNav from "./SideNav"; // Importing the SideNav component

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
      console.error(
        "Error fetching accounts:",
        err.response?.data || err.message
      );
      setError("Failed to fetch accounts. Please try again later.");
    }
  };

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="acc_container">
      <div className="account_cont1">
        <SideNav />
      </div>
      <div className="account_cont2">
        <h1>Accounts</h1>
        <button onClick={() => navigate("/create-account")}>
          Create Account
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {accounts.length > 0 ? (
          <table
            border="1"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
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
                  <td>
                    <button
                      onClick={() => navigate(`/account-details/${account.id}`)}
                      style={{
                        color: "blue",
                        textDecoration: "none",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      {account.name}
                    </button>
                  </td>
                  <td>{account.billing_city}</td>
                  <td>{account.billing_country}</td>
                  <td>{account.office_phone}</td>
                  <td>
                    <button
                      onClick={() =>
                        navigate(
                          `/user-details/${account.assigned_to_username}`
                        )
                      }
                      style={{
                        color: "blue",
                        textDecoration: "none",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      {account.assigned_to_username}
                    </button>
                  </td>
                  <td>{account.email_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No accounts found.</p>
        )}
      </div>
    </div>
  );
};

export default AccountsPage;
