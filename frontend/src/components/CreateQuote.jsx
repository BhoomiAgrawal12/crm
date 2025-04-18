import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateQuote = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    quote_title: "",
    quote_number: "",
    valid_until: "",
    assigned_to: "",
    approval_status: "",
    opportunity: "",
    quote_stage: "",
    invoice_status: "",
    payment_terms: "",
    payment_terms_other: "",
    approval_issues: "",
    account: "",
    contact: "",
    billing_address_street: "",
    billing_address_city: "",
    billing_address_state: "",
    billing_address_postalcode: "",
    billing_address_country: "",
    shipping_address_street: "",
    shipping_address_city: "",
    shipping_address_state: "",
    shipping_address_postalcode: "",
    shipping_address_country: "",
    description: "",
    currency: "",
    total: "",
    discount: "",
    sub_total: "",
    shipping: "",
    shipping_tax: "",
    tax: "",
    grand_total: "",
  });

  const [users, setUsers] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [choices, setChoices] = useState({
    approval_status: [],
    quote_stage: [],
    invoice_status: [],
    payment_terms: [],
    currency: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token"); // Retrieve the token from localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add the Authorization header
          },
        };

        const [usersRes, opportunitiesRes, accountsRes, contactsRes, choicesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/users/", config),
          axios.get("http://localhost:8000/api/opportunities/", config),
          axios.get("http://localhost:8000/api/accounts/", config),
          axios.get("http://localhost:8000/api/contacts/", config),
          axios.get("http://localhost:8000/api/quote-choices/", config),
        ]);

        setUsers(usersRes.data);
        setOpportunities(opportunitiesRes.data);
        setAccounts(accountsRes.data);
        setContacts(contactsRes.data);
        setChoices(choicesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to fetch dropdown data. Please check your authentication.");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.post("http://localhost:8000/api/quotes/", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("Quote created successfully!");
      navigate("/quotes");
    } catch (err) {
      console.error("Error creating quote:", err);
      alert("Failed to create quote. Please try again.");
    }
  };

  return (
    <div className="create-quote-container">
      <h1>Create Quote</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <strong>Quote Title:</strong>
          <input
            type="text"
            name="quote_title"
            value={formData.quote_title}
            onChange={handleInputChange}
            required
          />
        </p>
        <p>
          <strong>Quote Number:</strong>
          <input
            type="number"
            name="quote_number"
            value={formData.quote_number}
            onChange={handleInputChange}
            required
          />
        </p>
        <p>
          <strong>Valid Until:</strong>
          <input
            type="date"
            name="valid_until"
            value={formData.valid_until}
            onChange={handleInputChange}
            required
          />
        </p>
        <p>
          <strong>Assigned To:</strong>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleInputChange}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </p>
        <p>
          <strong>Approval Status:</strong>
          <select
            name="approval_status"
            value={formData.approval_status}
            onChange={handleInputChange}
          >
            <option value="">Select Approval Status</option>
            {choices.approval_status.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </p>
        <p>
          <strong>Opportunity:</strong>
          <select
            name="opportunity"
            value={formData.opportunity}
            onChange={handleInputChange}
          >
            <option value="">Select Opportunity</option>
            {opportunities.map((opportunity) => (
              <option key={opportunity.id} value={opportunity.id}>
                {opportunity.opportunity_name}
              </option>
            ))}
          </select>
        </p>
        <p>
          <strong>Quote Stage:</strong>
          <select
            name="quote_stage"
            value={formData.quote_stage}
            onChange={handleInputChange}
          >
            <option value="">Select Quote Stage</option>
            {choices.quote_stage.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </p>
        <p>
          <strong>Invoice Status:</strong>
          <select
            name="invoice_status"
            value={formData.invoice_status}
            onChange={handleInputChange}
          >
            <option value="">Select Invoice Status</option>
            {choices.invoice_status.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </p>
        <p>
          <strong>Payment Terms:</strong>
          <select
            name="payment_terms"
            value={formData.payment_terms}
            onChange={handleInputChange}
          >
            <option value="">Select Payment Terms</option>
            {choices.payment_terms.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </p>
        <p>
          <strong>Payment Terms Other:</strong>
          <input
            type="text"
            name="payment_terms_other"
            value={formData.payment_terms_other}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Approval Issues:</strong>
          <textarea
            name="approval_issues"
            value={formData.approval_issues}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Account:</strong>
          <select
            name="account"
            value={formData.account}
            onChange={handleInputChange}
          >
            <option value="">Select Account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </p>
        <p>
          <strong>Contact:</strong>
          <select
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
          >
            <option value="">Select Contact</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.first_name} {contact.last_name}
              </option>
            ))}
          </select>
        </p>
        <p>
          <strong>Billing Address:</strong>
          <input
            type="text"
            name="billing_address_street"
            placeholder="Street"
            value={formData.billing_address_street}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="billing_address_city"
            placeholder="City"
            value={formData.billing_address_city}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="billing_address_state"
            placeholder="State"
            value={formData.billing_address_state}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="billing_address_postalcode"
            placeholder="Postal Code"
            value={formData.billing_address_postalcode}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="billing_address_country"
            placeholder="Country"
            value={formData.billing_address_country}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Shipping Address:</strong>
          <input
            type="text"
            name="shipping_address_street"
            placeholder="Street"
            value={formData.shipping_address_street}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="shipping_address_city"
            placeholder="City"
            value={formData.shipping_address_city}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="shipping_address_state"
            placeholder="State"
            value={formData.shipping_address_state}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="shipping_address_postalcode"
            placeholder="Postal Code"
            value={formData.shipping_address_postalcode}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="shipping_address_country"
            placeholder="Country"
            value={formData.shipping_address_country}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Description:</strong>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Currency:</strong>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
          >
            <option value="">Select Currency</option>
            {choices.currency.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </p>
        <p>
          <strong>Total:</strong>
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Discount:</strong>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Sub Total:</strong>
          <input
            type="number"
            name="sub_total"
            value={formData.sub_total}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Shipping:</strong>
          <input
            type="number"
            name="shipping"
            value={formData.shipping}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Shipping Tax:</strong>
          <input
            type="number"
            name="shipping_tax"
            value={formData.shipping_tax}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Tax:</strong>
          <input
            type="number"
            name="tax"
            value={formData.tax}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Grand Total:</strong>
          <input
            type="number"
            name="grand_total"
            value={formData.grand_total}
            onChange={handleInputChange}
          />
        </p>
        <button type="submit" className="save-button">
          Save
        </button>
        <button type="button" onClick={() => navigate(-1)} className="cancel-button">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateQuote;