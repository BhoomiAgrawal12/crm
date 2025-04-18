import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './QuotesPage.css';

const QuotesPage = () => {
  const [quotes, setQuotes] = useState([]); // State to store quotes
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Fetch quotes from the API
    const fetchQuotes = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/quotes/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setQuotes(response.data); // Set the quotes data
      } catch (err) {
        console.error('Error fetching quotes:', err);
        setError('Failed to load quotes. Please try again later.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchQuotes();
  }, []);

  return (
    <div className="quotes-container">
      <h1>Quotes</h1>
      <button
        className="create-quote-button"
        onClick={() => navigate('/create-quote')}
      >
        Create Quote
      </button>
      {loading ? (
        <p>Loading quotes...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : quotes.length === 0 ? (
        <p>No quotes available.</p>
      ) : (
        <table className="quotes-table">
          <thead>
            <tr>
              <th>Quote Number</th>
              <th>Title</th>
              <th>Stage</th>
              <th>Contact</th>
              <th>Account</th>
              <th>Grand Total</th>
              <th>Valid Until</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id}>
                <td>{quote.quote_number}</td>
                <td>
                <Link to={`/quote-details/${quote.id}`} className="view-link">
                    {quote.quote_title}
                </Link>
                </td>
                <td>{quote.quote_stage}</td>
                <td>
                  <Link to={`/contact-details/${quote.contact}`} className="view-link">
                    {quote.contact_name || 'N/A'}
                  </Link>
                </td>
                <td>
                <Link to={`/account-details/${quote.account}`} className="view-link">
                  {quote.account_name || 'N/A'}
                  </Link>
                </td>
                <td>{quote.currency} {quote.grand_total}</td>
                <td>{quote.valid_until}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuotesPage;