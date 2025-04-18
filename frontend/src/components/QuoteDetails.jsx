import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './QuoteDetails.css';

const QuoteDetails = () => {
  const { id } = useParams(); // Get the quote ID from the URL
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null); // State to store quote details
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({}); // State to store form data for editing
  const [approvalStatusChoices, setApprovalStatusChoices] = useState([]);
  const [quoteStageChoices, setQuoteStageChoices] = useState([]);
  const [invoiceStatusChoices, setInvoiceStatusChoices] = useState([]);
  const [paymentTermsChoices, setPaymentTermsChoices] = useState([]);
  const [currencyChoices, setCurrencyChoices] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  
  
  

  useEffect(() => {
    // Fetch quote details from the API
    const fetchQuoteDetails = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get(`http://localhost:8000/api/quotes/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setQuote(response.data); // Set the quote data
        setFormData(response.data); // Initialize form data for editing
      } catch (err) {
        console.error('Error fetching quote details:', err);
        setError('Failed to load quote details. Please try again later.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    const fetchChoices = async () => {
        try {
          const accessToken = localStorage.getItem('access_token');
          const response = await axios.get('http://localhost:8000/api/quote-choices/', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setApprovalStatusChoices(response.data.approval_status);
          setQuoteStageChoices(response.data.quote_stage);
          setInvoiceStatusChoices(response.data.invoice_status);
          setPaymentTermsChoices(response.data.payment_terms);
          setCurrencyChoices(response.data.currency);
        } catch (err) {
          console.error('Error fetching approval status choices:', err);
        }
      };
      const fetchData = async () => {
        try {
          const accessToken = localStorage.getItem('access_token');
          const [opportunitiesRes, accountsRes, contactsRes] = await Promise.all([
            axios.get('http://localhost:8000/api/opportunities/', {
              headers: { Authorization: `Bearer ${accessToken}` },
            }),
            axios.get('http://localhost:8000/api/accounts/', {
              headers: { Authorization: `Bearer ${accessToken}` },
            }),
            axios.get('http://localhost:8000/api/contacts/', {
              headers: { Authorization: `Bearer ${accessToken}` },
            }),
          ]);
          setOpportunities(opportunitiesRes.data);
          setAccounts(accountsRes.data);
          setContacts(contactsRes.data);
        } catch (err) {
          console.error('Error fetching dropdown data:', err);
        }
      };

    fetchQuoteDetails();
    fetchData();
    fetchChoices();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.put(
        `http://localhost:8000/api/quotes/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setQuote(response.data); // Update the quote data with the saved changes
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error('Error saving quote details:', err);
      setError('Failed to save quote details. Please try again later.');
    }
  };

  if (loading) {
    return <p>Loading quote details...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!quote) {
    return <p>No quote details available.</p>;
  }

  return (
    <div className="quote-details-container">
      <h1>Quote Details</h1>
      {isEditing ? (
        <div className="quote-edit-form">
          <p>
            <strong>Quote Number:</strong>
            <input
              type="text"
              name="quote_number"
              value={formData.quote_number || ''}
              onChange={handleInputChange}
            />
          </p>  
          <p>
            <strong>Quote Title:</strong>
            <input
              type="text"
              name="quote_title"
              value={formData.quote_title || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Valid Until:</strong>
            <input
              type="date"
              name="valid_until"
              value={formData.valid_until || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Assigned To:</strong>
            {quote.assigned_to_username}
          </p>
          <p>
            <strong>Approval Status:</strong>
            <select
              name="approval_status"
              value={formData.approval_status || ''}
              onChange={handleInputChange}
            >
              <option value="">Select Approval Status</option>
              {approvalStatusChoices.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </p>
          <p>
            <strong>Opportunity:</strong>
            <select
              name="opportunity_name"
              value={formData.opportunity_name || ''}
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
              value={formData.quote_stage || ''}
              onChange={handleInputChange}
            >
              <option value="">Select Quote Stage</option>
              {quoteStageChoices.map(([value, label]) => (
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
              value={formData.invoice_status || ''}
              onChange={handleInputChange}
            >
              <option value="">Select Invoice Status</option>
              {invoiceStatusChoices.map(([value, label]) => (
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
              value={formData.payment_terms || ''}
              onChange={handleInputChange}
            >
              <option value="">Select Payment Terms</option>
              {paymentTermsChoices.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </p>
          <p>
            <strong>Payment Terms Other:</strong>
            <input
              name="payment_terms_other"
              type="text"
              value={formData.payment_terms_other || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Approval Issues:</strong>
            <input
              name="approval_issues"
              type="text"
              value={formData.approval_issues || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Account:</strong>
            <select
              name="account"
              value={formData.account || ''}
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
              name="contact_name"
              value={formData.contact_name || ''}
              onChange={handleInputChange}
            >
              <option value="">Select Contact</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.first_name}
                </option>
              ))}
            </select>
          </p>
          <p>
            <strong>Billing Address Street:</strong>
            <input
              type="text"
              name="billing_address_street"
              value={formData.billing_address_street || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Billing Address City:</strong>
            <input
              type="text"
              name="billing_address_city"
              value={formData.billing_address_city || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Billing Address State:</strong>
            <input
              type="text"
              name="billing_address_state"
              value={formData.billing_address_state || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Billing Address Postal Code:</strong>
            <input
              type="text"
              name="billing_address_pstalcode"
              value={formData.billing_address_postalcode || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Billing Address Country:</strong>
            <input
              type="text"
              name="billing_address_country"
              value={formData.billing_address_country || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Shipping Address Street:</strong>
            <input
              type="text"
              name="shipping_address_street"
              value={formData.shipping_address_street || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Shipping Address City:</strong>
            <input
              type="text"
              name="shipping_address_city"
              value={formData.shipping_address_city || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Shipping Address State:</strong>
            <input
              type="text"
              name="shipping_address_state"
              value={formData.shipping_address_state || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Shipping Address Postal Code:</strong>
            <input
              type="text"
              name="shipping_address_postalcode"
              value={formData.shipping_address_postalcode || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Shipping Address Country:</strong>
            <input
              type="text"
              name="shipping_address_country"
              value={formData.shipping_address_country || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Description:</strong>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Currency:</strong>
            <select
              name="currency"
              value={formData.currency || ''}
              onChange={handleInputChange}
            >
              <option value="">Select Currency</option>
              {currencyChoices.map(([value, label]) => (
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
        
          <button onClick={handleSave} className="save-button">Save</button>
          <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
        </div>
      ) : (
        <div className="quote-details">
          <p><strong>Quote Number:</strong> {quote.quote_number}</p>
          <p><strong>Title:</strong> {quote.quote_title}</p>
          <p><strong>Valid Until:</strong> {quote.valid_until}</p>
          <p><strong>Assigned To:</strong> {quote.assigned_to_username}</p>
          <p><strong>Quote Stage:</strong> {quote.quote_stage}</p>
          <p><strong>Approval Status:</strong> {quote.approval_status}</p>
          <p><strong>Opportunity:</strong> {quote.opportunity_name}</p>
          <p><strong>Invoice Status:</strong> {quote.invoice_status}</p>
          <p><strong>Payment Terms:</strong> {quote.payment_terms}</p>
          <p><strong>Payment Terms Others(If Any):</strong> {quote.payment_terms_other}</p>
          <p><strong>Approval Issues:</strong> {quote.approval_issues}</p>
          <p><strong>Account:</strong> {quote.account_name || 'N/A'}</p>
          <p><strong>Contact:</strong> {quote.contact_name || 'N/A'}</p>
          <h3>Billing Address</h3>
          <p>{quote.billing_address_street},
            {quote.billing_address_city},
            {quote.billing_address_state},
            {quote.billing_address_postalcode},
            {quote.billing_address_country}</p>
          <h3>Shipping Address</h3>
          <p>{quote.shipping_address_street},
            {quote.shipping_address_city},
            {quote.shipping_address_state},
            {quote.shipping_address_postalcode},
            {quote.shipping_address_country}</p>
          <p><strong>Description:</strong> {quote.description || 'N/A'}</p>
          <p><strong>Currency:</strong> {quote.currency}</p>
          <p><strong>Total:</strong> {quote.total}</p>
          <p><strong>Discount:</strong> {quote.discount}</p>
          <p><strong>Sub Total:</strong> {quote.sub_total}</p>
          <p><strong>Shipping:</strong> {quote.shipping}</p>
          <p><strong>Shipping Tax:</strong> {quote.shipping_tax}</p>
          <p><strong>Tax:</strong> {quote.tax}</p>
          <p><strong>Grand Total:</strong> {quote.grand_total || 'N/A'}</p>
          <p><strong>Created By:</strong> {quote.created_by_username} <strong>At: </strong> {quote.created_at} </p>
          <p><strong>Modified By:</strong> {quote.modified_by_username} <strong>At: </strong> {quote.modified_at} </p>
          <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
        </div>
      )}
      <button onClick={() => navigate(-1)} className="back-button">Back</button>
    </div>
  );
};

export default QuoteDetails;