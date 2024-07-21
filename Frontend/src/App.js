// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Address from './components/Address/Address';
import OrderSummary from './components/OrderSummary/OrderSummary';
import Payment from './components/Payment/Payment';
import AdminPanel from './components/AdminPanel/AdminPanel';
import Login from './components/AdminPanel/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check local storage for authentication state
    const savedAuthState = localStorage.getItem('isAuthenticated');
    return savedAuthState === 'true';
  });

  useEffect(() => {
    // Persist authentication state to local storage
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/address" element={<Address />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/payment" element={<Payment />} />
        <Route 
          path="/admin" 
          element={isAuthenticated ? <AdminPanel setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
