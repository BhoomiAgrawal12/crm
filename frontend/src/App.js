import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/LoginPage';
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import AccountsPage from './components/AccountsPage';
import CreateContact from './components/CreateContact';
import ContactsPage from './components/ContactsPage';
import AccountDetails from './components/AccountDetails';
import UserDetails from './components/UserDetails';
import ContactDetails from './components/ContactDetails';
import OpportunityPage from './components/OpportunityPage';
import CreateOpportunity from './components/CreateOpportunity';
import OpportunityDetails from './components/OpportunityDetails';
import LeadsPage from './components/LeadsPage';
import CreateLead from './components/CreateLead';
import LeadDetails from './components/LeadDetails';
import TaskPage from './components/TaskPage';
import CreateTask from './components/CreateTask';
import TaskDetails from './components/TaskDetails';
import QuotesPage from './components/QuotesPage';
import QuoteDetails from './components/QuoteDetails';
import CreateQuote from './components/CreateQuote';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/create-contact" element={<CreateContact />} />
        <Route path="/account-details/:id" element={<AccountDetails />} />
        <Route path="/user-details/:username" element={<UserDetails />} />
        <Route path="/contact-details/:id" element={<ContactDetails />} />
        <Route path="/opportunities" element={<OpportunityPage />} />
        <Route path="/create-opportunity" element={<CreateOpportunity />} />
        <Route path="/opportunity-details/:id" element={<OpportunityDetails />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/lead-details/:id" element={<LeadDetails />} />
        <Route path="/create-lead" element={<CreateLead />} />  
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/task-details/:id" element={<TaskDetails />} />
        <Route path="/quotes" element={<QuotesPage />} />
        <Route path="/create-quote" element={<CreateQuote />} />
        <Route path="/quote-details/:id" element={<QuoteDetails />} />      
      </Routes>
    </Router>
  );
}

export default App;
