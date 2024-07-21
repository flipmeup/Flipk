// AdminPanel.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProductForm from './AddProductForm';
import ProductsList from './ProductList';
import ChangeUPIForm from './ChangeUPIForm';
import './AdminPanel.css';

const AdminPanel = ({ setIsAuthenticated }) => {
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [showChangeUPIForm, setShowChangeUPIForm] = useState(false);
    const [showProductsList, setShowProductsList] = useState(false); // State for Products List
    const navigate = useNavigate();

    const toggleAddProductForm = () => {
        setShowAddProductForm(!showAddProductForm);
        setShowChangeUPIForm(false); // Close UPI form when opening Add Product form
        setShowProductsList(false); // Close Products List when opening Add Product form
    };

    const toggleChangeUPIForm = () => {
        setShowChangeUPIForm(!showChangeUPIForm);
        setShowAddProductForm(false); // Close Add Product form when opening UPI form
        setShowProductsList(false); // Close Products List when opening UPI form
    };

    const toggleProductList = () => {
        setShowProductsList(!showProductsList);
        setShowAddProductForm(false); // Close Add Product form when opening Products List
        setShowChangeUPIForm(false); // Close UPI form when opening Products List
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <div className="admin-panel">
            {/* Sidebar */}
            <div className="sidebar">
                <ul>
                    <li><button onClick={toggleAddProductForm}>Add Product</button></li>
                    <li><button onClick={toggleChangeUPIForm}>Change UPI</button></li>
                    <li><button onClick={toggleProductList}>All Products</button></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </div>

            {/* Content Area */}
            <div className="content">
                <h1>Welcome to Admin Panel</h1>
                {/* Conditional rendering based on state */}
                {showAddProductForm && <AddProductForm onClose={() => setShowAddProductForm(false)} />}
                {showChangeUPIForm && <ChangeUPIForm onClose={() => setShowChangeUPIForm(false)} />}
                {showProductsList && <ProductsList />}
            </div>
        </div>
    );
};

export default AdminPanel;
