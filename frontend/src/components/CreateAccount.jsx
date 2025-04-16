import React, { useState } from 'react';
import './CreateAccount.css';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    name: '',
    assignedTo: '',
    website: '',
    officePhone: '',
    email: '',
    billing: {
      street: '',
      postalCode: '',
      city: '',
      state: '',
      country: ''
    },
    shipping: {
      street: '',
      postalCode: '',
      city: '',
      state: '',
      country: ''
    },
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('billing.') || name.startsWith('shipping.')) {
      const [section, key] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.officePhone && !/^[\d\s\-()+]+$/.test(formData.officePhone)) {
      newErrors.officePhone = 'Invalid phone number';
    }
    
    if (formData.website && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.website)) {
      newErrors.website = 'Invalid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      alert('Account created successfully!');
      // Reset form after successful submission
      setFormData({
        name: '',
        assignedTo: '',
        website: '',
        officePhone: '',
        email: '',
        billing: { street: '', postalCode: '', city: '', state: '', country: '' },
        shipping: { street: '', postalCode: '', city: '', state: '', country: '' },
        description: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shipping: { ...prev.billing }
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="create-account-container">
      <h2>Create Account</h2>

      <div className="section-tabs">
        <button 
          className={activeTab === 'overview' ? 'active-tab' : ''}
          onClick={() => handleTabChange('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'more-info' ? 'active-tab' : ''}
          onClick={() => handleTabChange('more-info')}
        >
          More Information
        </button>
        <button 
          className={activeTab === 'other' ? 'active-tab' : ''}
          onClick={() => handleTabChange('other')}
        >
          Other
        </button>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        {activeTab === 'overview' && (
          <>
            {/* Row 1 */}
            <div className="form-group">
              <label>Name<span className="required">*</span></label>
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
              <select 
                name="assignedTo" 
                value={formData.assignedTo} 
                onChange={handleChange}
                className="select-input"
              >
                <option value="">Select user</option>
                <option value="user1">User 1</option>
                <option value="user2">User 2</option>
                <option value="user3">User 3</option>
              </select>
            </div>

            {/* Row 2 */}
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
                name="officePhone" 
                value={formData.officePhone} 
                onChange={handleChange} 
                placeholder="Enter phone number" 
                className={errors.officePhone ? 'error-input' : ''}
              />
              {errors.officePhone && <span className="error-message">{errors.officePhone}</span>}
            </div>

            {/* Email */}
            <div className="email-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Enter email" 
                className={errors.email ? 'error-input' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </>
        )}

        {activeTab === 'more-info' && (
          <div className="address-section">
            <div className="address-column">
              <h3>Billing Address</h3>
              {Object.keys(formData.billing).map(field => (
                <input 
                  key={`billing.${field}`}
                  type="text" 
                  name={`billing.${field}`} 
                  value={formData.billing[field]} 
                  onChange={handleChange} 
                  placeholder={`Billing ${field.charAt(0).toUpperCase() + field.slice(1)}`} 
                />
              ))}
            </div>
            
            <div className="address-column">
              <div className="address-header">
                <h3>Shipping Address</h3>
                <button 
                  type="button" 
                  className="copy-address-btn"
                  onClick={copyBillingToShipping}
                >
                  Copy from Billing
                </button>
              </div>
              {Object.keys(formData.shipping).map(field => (
                <input 
                  key={`shipping.${field}`}
                  type="text" 
                  name={`shipping.${field}`} 
                  value={formData.shipping[field]} 
                  onChange={handleChange} 
                  placeholder={`Shipping ${field.charAt(0).toUpperCase() + field.slice(1)}`} 
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'other' && (
          <div className="description-group">
            <label>DESCRIPTION</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Enter account description" 
              rows="4"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="form-buttons">
          <button 
            type="submit" 
            className="save-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;