import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

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
      });
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Create Account</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Assigned To (User ID):</label>
          <input
            type="number"
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Website:</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Office Phone:</label>
          <input
            type="text"
            name="office_phone"
            value={formData.office_phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email Address:</label>
          <input
            type="email"
            name="email_address"
            value={formData.email_address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Billing Street:</label>
          <input
            type="text"
            name="billing_street"
            value={formData.billing_street}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Billing Postal Code:</label>
          <input
            type="text"
            name="billing_postal_code"
            value={formData.billing_postal_code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Billing City:</label>
          <input
            type="text"
            name="billing_city"
            value={formData.billing_city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Billing State:</label>
          <input
            type="text"
            name="billing_state"
            value={formData.billing_state}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Billing Country:</label>
          <input
            type="text"
            name="billing_country"
            value={formData.billing_country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Shipping Street:</label>
          <input
            type="text"
            name="shipping_street"
            value={formData.shipping_street}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Shipping Postal Code:</label>
          <input
            type="text"
            name="shipping_postal_code"
            value={formData.shipping_postal_code}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Shipping City:</label>
          <input
            type="text"
            name="shipping_city"
            value={formData.shipping_city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Shipping State:</label>
          <input
            type="text"
            name="shipping_state"
            value={formData.shipping_state}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Shipping Country:</label>
          <input
            type="text"
            name="shipping_country"
            value={formData.shipping_country}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default CreateAccount;