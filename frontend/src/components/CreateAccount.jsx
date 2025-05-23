import React, { useState, useEffect } from 'react';
import './CreateAccount.css';
import axios from 'axios';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    name: '',
    assigned_to: '',
    website: '',
    office_phone: '',
    email_address: '',
    billing_street: '',
    billing_postal_code: '',
    billing_city: '',
    billing_state: '',
    billing_country: '',
    shipping_street: '',
    shipping_postal_code: '',
    shipping_city: '',
    shipping_state: '',
    shipping_country: '',
    description: '',
    account_type: '',
    industry_type: '',
    annual_revenue: '',
    employees: '',
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [choices, setChoices] = useState({ account_type: [], industry_type: [] });
  const [assignedToUsername, setAssignedToUsername] = useState('');

  // Fetch users and current user
  useEffect(() => {
    const fetchChoices = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/account/choices/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setChoices({
          account_type: response.data.account_type.map(([value, label]) => ({ value, label })),
          industry_type: response.data.industry_type.map(([value, label]) => ({ value, label }))
        });
      } catch (error) {
        console.error('Error fetching choices:', error);
        alert('Failed to fetch choices. Please try again later.');
      }
    };

    const fetchUsersAndCurrentUser = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const currentUserResponse = await axios.get('http://localhost:8000/api/current-user/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const currentUserId = currentUserResponse.data.id;
        const currentUsername = currentUserResponse.data.username;

        setFormData((prev) => ({
          ...prev,
          assigned_to: currentUserId,
        }));

        setAssignedToUsername(currentUsername);
      } catch (error) {
        console.error('Error fetching current user:', error);
        alert('Failed to fetch current user. Please try again later.');
      }
    };

    fetchUsersAndCurrentUser();
    fetchChoices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (formData.email_address && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_address)) {
        newErrors.email_address = 'Invalid email format';
      }
      
      if (formData.office_phone && !/^[\d\s\-()+]+$/.test(formData.office_phone)) {
        newErrors.office_phone = 'Invalid phone number';
      }
      
      if (formData.website && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.website)) {
        newErrors.website = 'Invalid website URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.post(
        'http://localhost:8000/api/accounts/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response from backend:', response.data);
      alert('Account created successfully!');
      // Reset form after successful submission
      setFormData({
        name: '',
        assigned_to: formData.assigned_to,
        website: '',
        office_phone: '',
        email_address: '',
        billing_street: '',
        billing_postal_code: '',
        billing_city: '',
        billing_state: '',
        billing_country: '',
        shipping_street: '',
        shipping_postal_code: '',
        shipping_city: '',
        shipping_state: '',
        shipping_country: '',
        description: '',
        account_type: '',
        industry_type: '',
        annual_revenue: '',
        employees: '',
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      alert('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBillingToShipping = () => {
    setFormData((prev) => ({
      ...prev,
      shipping_street: prev.billing_street,
      shipping_postal_code: prev.billing_postal_code,
      shipping_city: prev.billing_city,
      shipping_state: prev.billing_state,
      shipping_country: prev.billing_country,
    }));
  };

  return (
    <div className="create-account-container">
      <h2>Create Account</h2>

      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className="progress-step">
          <div className={`step-number ${currentStep >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-label ${currentStep === 1 ? 'active' : ''}`}>Overview</div>
        </div>
        <div className="progress-step">
          <div className={`step-number ${currentStep >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step-label ${currentStep === 2 ? 'active' : ''}`}>More Info</div>
        </div>
        <div className="progress-step">
          <div className={`step-number ${currentStep >= 3 ? 'active' : ''}`}>3</div>
          <div className={`step-label ${currentStep === 3 ? 'active' : ''}`}>Other</div>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <>
            <div className="form-group">
              <label>
                Name<span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className={errors.name ? 'error-input' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Assigned To</label>
              <input
                type="text"
                name="assigned_to"
                value={assignedToUsername}
                readOnly
                className="select-input"
              />
            </div>

            <div className="form-group">
              <label>Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website URL"
                className={errors.website ? 'error-input' : ''}
              />
              {errors.website && <span className="error-message">{errors.website}</span>}
            </div>

            <div className="form-group">
              <label>Office Phone</label>
              <input
                type="tel"
                name="office_phone"
                value={formData.office_phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={errors.office_phone ? 'error-input' : ''}
              />
              {errors.office_phone && <span className="error-message">{errors.office_phone}</span>}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email_address"
                value={formData.email_address}
                onChange={handleChange}
                placeholder="Enter email"
                className={errors.email_address ? 'error-input' : ''}
              />
              {errors.email_address && <span className="error-message">{errors.email_address}</span>}
            </div>

            <div className="form-group">
              <label>Account Type</label>
              <select
                name="account_type"
                value={formData.account_type}
                onChange={handleChange}
                className="select-input"
              >
                <option value="">Select account type</option>
                {choices.account_type.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Industry</label>
              <select
                name="industry_type"
                value={formData.industry_type}
                onChange={handleChange}
                className="select-input"
              >
                <option value="">Select industry</option>
                {choices.industry_type.map((industry_type) => (
                  <option key={industry_type.value} value={industry_type.value}>
                    {industry_type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Annual Revenue</label>
              <input
                type="text"
                name="annual_revenue"
                value={formData.annual_revenue}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Employees</label>
              <input
                type="text"
                name="employees"
                value={formData.employees}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {currentStep === 2 && (
          <div className="address-section">
            <div className="address-column">
              <h3>Billing Address</h3>
              <input
                type="text"
                name="billing_street"
                value={formData.billing_street}
                onChange={handleChange}
                placeholder="Street"
              />
              <input
                type="text"
                name="billing_city"
                value={formData.billing_city}
                onChange={handleChange}
                placeholder="City"
              />
              <input
                type="text"
                name="billing_state"
                value={formData.billing_state}
                onChange={handleChange}
                placeholder="State"
              />
              <input
                type="text"
                name="billing_postal_code"
                value={formData.billing_postal_code}
                onChange={handleChange}
                placeholder="Postal Code"
              />
              <input
                type="text"
                name="billing_country"
                value={formData.billing_country}
                onChange={handleChange}
                placeholder="Country"
              />
            </div>

            <div className="address-column">
              <h3>Shipping Address</h3>
              <input
                type="text"
                name="shipping_street"
                value={formData.shipping_street}
                onChange={handleChange}
                placeholder="Street"
              />
              <input
                type="text"
                name="shipping_city"
                value={formData.shipping_city}
                onChange={handleChange}
                placeholder="City"
              />
              <input
                type="text"
                name="shipping_state"
                value={formData.shipping_state}
                onChange={handleChange}
                placeholder="State"
              />
              <input
                type="text"
                name="shipping_postal_code"
                value={formData.shipping_postal_code}
                onChange={handleChange}
                placeholder="Postal Code"
              />
              <input
                type="text"
                name="shipping_country"
                value={formData.shipping_country}
                onChange={handleChange}
                placeholder="Country"
              />
              <button
                type="button"
                className="copy-address-btn"
                onClick={copyBillingToShipping}
              >
                Copy from Billing
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="description-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter account description"
              rows="4"
            />
          </div>
        )}

        <div className="form-buttons">
          {currentStep > 1 && (
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={handlePrevious}
            >
              Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button 
              type="button" 
              className="next-btn" 
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              className="save-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;