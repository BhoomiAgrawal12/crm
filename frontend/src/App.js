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
      </Routes>
    </Router>
  );
}

export default App;
