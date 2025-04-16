import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import "./OpportunityPage.css";

const OpportunityPage = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        setError("You are not authenticated. Please log in.");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/opportunities/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setOpportunities(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching opportunities:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch opportunities. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter(opportunity => {
    const searchLower = searchTerm.toLowerCase();
    return (
      opportunity.opportunity_name?.toLowerCase().includes(searchLower) ||
      opportunity.account_name?.toLowerCase().includes(searchLower) ||
      opportunity.sales_stage?.toLowerCase().includes(searchLower) ||
      opportunity.assigned_to_username?.toLowerCase().includes(searchLower) ||
      opportunity.opportunity_amount?.toString().includes(searchTerm)
    );
  });

  const formatCurrency = (amount, currency) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSalesStageClass = (stage) => {
    if (!stage) return '';
    const stageLower = stage.toLowerCase();
    if (stageLower.includes('prospect')) return 'sales-stage-prospecting';
    if (stageLower.includes('qualif')) return 'sales-stage-qualification';
    if (stageLower.includes('proposal')) return 'sales-stage-proposal';
    if (stageLower.includes('negotiat')) return 'sales-stage-negotiation';
    if (stageLower.includes('closed')) return 'sales-stage-closed';
    return '';
  };

  return (
    <div className="opportunity-container">
      <div className="opportunity-header">
        <SideNav />
      </div>
      <div className="opportunity-content">
        <div className="opportunity-card">
          <div className="page-header">
            <h1 className="page-title">Opportunities</h1>
            <div className="button-group">
              <button
                className="button button-success"
                onClick={() => navigate("/create-opportunity")}
                aria-label="Create new opportunity"
              >
                <span>+</span> Create Opportunity
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
              placeholder="Search opportunities..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <span>Loading opportunities...</span>
            </div>
          ) : filteredOpportunities.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Opportunity</th>
                    <th>Account</th>
                    <th>Sales Stage</th>
                    <th>Amount</th>
                    <th>Expected Close</th>
                    <th>Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOpportunities.map((opportunity) => (
                    <tr key={opportunity.id}>
                      <td>
                        <button
                          onClick={() => navigate(`/opportunity-details/${opportunity.id}`)}
                          className="table-link"
                          aria-label={`View details for ${opportunity.opportunity_name}`}
                        >
                          {opportunity.opportunity_name}
                        </button>
                      </td>
                      <td>
                        {opportunity.account_name ? (
                          <button
                            onClick={() => navigate(`/account-details/${opportunity.account}`)}
                            className="table-link"
                            aria-label={`View account ${opportunity.account_name}`}
                          >
                            {opportunity.account_name}
                          </button>
                        ) : '-'}
                      </td>
                      <td>
                        {opportunity.sales_stage && (
                          <span className={`sales-stage-badge ${getSalesStageClass(opportunity.sales_stage)}`}>
                            {opportunity.sales_stage}
                          </span>
                        )}
                      </td>
                      <td>
                        {formatCurrency(opportunity.opportunity_amount, opportunity.currency)}
                      </td>
                      <td>{formatDate(opportunity.expected_close_date)}</td>
                      <td>
                        {opportunity.assigned_to_username ? (
                          <button
                            onClick={() => navigate(`/user-details/${opportunity.assigned_to_username}`)}
                            className="table-link"
                            aria-label={`View user ${opportunity.assigned_to_username}`}
                          >
                            {opportunity.assigned_to_username}
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
                <p>No opportunities match your search criteria.</p>
              ) : (
                <p>No opportunities found. Create your first opportunity to get started.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityPage;