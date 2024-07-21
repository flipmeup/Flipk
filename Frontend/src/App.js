import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Address from './components/Address/Address';
import OrderSummary from './components/OrderSummary/OrderSummary';
import Payment from './components/Payment/Payment';
import AdminPanel from './components/AdminPanel/AdminPanel';
// import About from './components/ProductDetails';
// import Contact from './components/Contact';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/product-details/:id" element={<ProductDetails/>} />
        <Route exact path="/address/" element={<Address/>} />
        <Route exact path="/order-summary/" element={<OrderSummary/>} />
        <Route exact path="/payment/" element={<Payment/>} />
        <Route exact path="/admin/" element={<AdminPanel/>} />




       
      </Routes>
    </Router>
  );
};

export default App;
