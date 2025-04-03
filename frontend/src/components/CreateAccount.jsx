import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import "./CreateAccount.css"; // Importing the CSS file for styling

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    name: "",
    assigned_to: "",
    website: "",
    office_phone: "",
    email_address: "",
    billing_street: "",
    billing_postal_code: "",
    billing_city: "",
    billing_state: "",
    billing_country: "",
    shipping_street: "",
    shipping_postal_code: "",
    shipping_city: "",
    shipping_state: "",
    shipping_country: "",
    description: "",
    account_type: "",
    industry: "",
    annual_revenue: "",
    employees: "",
  });

  const [users, setUsers] = useState([]); // State to store users
  const [accountTypes, setAccountTypes] = useState([]); // State to store account type choices
  const [industries, setIndustries] = useState([]); // State to store industry choices
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch users, accounts, and choices from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        // Fetch users
        const usersResponse = await axios.get("http://localhost:8000/api/users/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsers(usersResponse.data);

        // Fetch account choices
        const choicesResponse = await axios.get("http://localhost:8000/api/account/choices/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAccountTypes(choicesResponse.data.account_type);
        setIndustries(choicesResponse.data.industry);
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

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/accounts/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response.data); // Log the response data for debugging

      setSuccess("Account created successfully!");
      setFormData({
        name: "",
        assigned_to: "",
        website: "",
        office_phone: "",
        email_address: "",
        billing_street: "",
        billing_postal_code: "",
        billing_city: "",
        billing_state: "",
        billing_country: "",
        shipping_street: "",
        shipping_postal_code: "",
        shipping_city: "",
        shipping_state: "",
        shipping_country: "",
        description: "",
        account_type: "",
        industry: "",
        annual_revenue: "",
        employees: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="CreateAccount_container">
      <div className="CreateAccount_container1">
        <SideNav />
      </div>
      <div className="CreateAccount_container2">
        <h2>Create Account</h2>
        <div className="wrapper">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="wrapper_box1">
              <div className="wrapper_box1_part1">
                <div className="input-field">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Assigned To:</label>
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
                <div className="input-field">
                  <label>Account Type:</label>
                  <select
                    name="account_type"
                    value={formData.account_type}
                    onChange={handleChange}
                  >
                    <option value="">Select an account type</option>
                    {accountTypes.map((type) => (
                      <option key={type[0]} value={type[0]}>
                        {type[1]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-field">
                  <label>Industry:</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                  >
                    <option value="">Select an industry</option>
                    {industries.map((industry) => (
                      <option key={industry[0]} value={industry[0]}>
                        {industry[1]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="wrapper_box1_part2">
                <div className="input-field">
                  <label>Website:</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-field">
                  <label>Office Phone:</label>
                  <input
                    type="text"
                    name="office_phone"
                    value={formData.office_phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Email Address:</label>
                  <input
                    type="email"
                    name="email_address"
                    value={formData.email_address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Annual Revenue:</label>
                  <input
                    type="number"
                    name="annual_revenue"
                    value={formData.annual_revenue}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-field">
                  <label>Employees:</label>
                  <input
                    type="number"
                    name="employees"
                    value={formData.employees}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="wrapper_box2">
              <div className="billing">
                <div className="input-field">
                  <label>Billing Street:</label>
                  <input
                    type="text"
                    name="billing_street"
                    value={formData.billing_street}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Billing Postal Code:</label>
                  <input
                    type="text"
                    name="billing_postal_code"
                    value={formData.billing_postal_code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Billing City:</label>
                  <input
                    type="text"
                    name="billing_city"
                    value={formData.billing_city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Billing State:</label>
                  <input
                    type="text"
                    name="billing_state"
                    value={formData.billing_state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Billing Country:</label>
                  <input
                    type="text"
                    name="billing_country"
                    value={formData.billing_country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="shipping">
                <div className="input-field">
                  <label>Shipping Street:</label>
                  <input
                    type="text"
                    name="shipping_street"
                    value={formData.shipping_street}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-field">
                  <label>Shipping Postal Code:</label>
                  <input
                    type="text"
                    name="shipping_postal_code"
                    value={formData.shipping_postal_code}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-field">
                  <label>Shipping City:</label>
                  <input
                    type="text"
                    name="shipping_city"
                    value={formData.shipping_city}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-field">
                  <label>Shipping State:</label>
                  <input
                    type="text"
                    name="shipping_state"
                    value={formData.shipping_state}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-field">
                  <label>Shipping Country:</label>
                  <input
                    type="text"
                    name="shipping_country"
                    value={formData.shipping_country}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="input-field">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div>
              <button type="submit">Save</button>
              <button onClick={() => navigate("/accounts")}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
