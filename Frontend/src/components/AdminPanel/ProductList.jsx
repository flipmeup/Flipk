import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ProductList.css'; // Import your ProductsList.css file
import ConfirmationModal from './ConfirmationModal';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);
    const [editField, setEditField] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setEditProductId(null);
                setEditField({});
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputRef]);

    const confirmUpdate = (productId, field, value) => {
        setConfirmAction(() => () => handleEdit(productId, field, value));
        setShowConfirm(true);
    };

    const handleEdit = async (productId, field, value) => {
        setShowConfirm(false);
        setEditProductId(null);
        setEditField({});
        const updatedProducts = products.map(product => {
            if (product.id === productId) {
                return {
                    ...product,
                    [field]: value
                };
            }
            return product;
        });
        setProducts(updatedProducts);

        try {
            await axios.put(`http://localhost:3000/api/products/${productId}`, {
                [field]: value
            });
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const confirmDelete = (productId) => {
        setConfirmAction(() => () => handleDelete(productId));
        setShowConfirm(true);
    };

    const handleDelete = async (productId) => {
        setShowConfirm(false);
        try {
            await axios.delete(`http://localhost:3000/api/products/${productId}`);
            const updatedProducts = products.filter(product => product.id !== productId);
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const startEditing = (productId, field, value) => {
        setEditProductId(productId);
        setEditField({ [field]: value });
    };

    const handleInputChange = (field, value) => {
        setEditField(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleKeyDown = (event, productId, field, value) => {
        if (event.key === 'Enter') {
            confirmUpdate(productId, field, value);
        }
    };

    return (
        <div className="products-list">
            <h2>All Products</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>M.R.P</th>
                        <th>S.P.</th>
                        <th>Description</th>
                        <th>Sizes</th>
                        <th>Variant</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>
                                {editProductId === product.id && editField.hasOwnProperty('image') ? (
                                    <input
                                        type="text"
                                        value={editField.image}
                                        ref={inputRef}
                                        onChange={(e) => handleInputChange('image', e.target.value)}
                                        onBlur={() => confirmUpdate(product.id, 'image', editField.image)}
                                        onKeyDown={(e) => handleKeyDown(e, product.id, 'image', editField.image)}
                                    />
                                ) : (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        height="50"
                                        onDoubleClick={() => startEditing(product.id, 'image', product.image)}
                                    />
                                )}
                            </td>
                            <td>
                                {editProductId === product.id && editField.hasOwnProperty('name') ? (
                                    <input
                                        type="text"
                                        value={editField.name}
                                        ref={inputRef}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        onBlur={() => confirmUpdate(product.id, 'name', editField.name)}
                                        onKeyDown={(e) => handleKeyDown(e, product.id, 'name', editField.name)}
                                    />
                                ) : (
                                    <span onDoubleClick={() => startEditing(product.id, 'name', product.name)}>
                                        {product.name}
                                    </span>
                                )}
                            </td>
                            <td>
                                {editProductId === product.id && editField.hasOwnProperty('mrp') ? (
                                    <input
                                        type="number"
                                        value={editField.mrp}
                                        ref={inputRef}
                                        onChange={(e) => handleInputChange('mrp', e.target.value)}
                                        onBlur={() => confirmUpdate(product.id, 'mrp', parseFloat(editField.mrp))}
                                        onKeyDown={(e) => handleKeyDown(e, product.id, 'mrp', parseFloat(editField.mrp))}
                                    />
                                ) : (
                                    <span onDoubleClick={() => startEditing(product.id, 'mrp', product.mrp)}>
                                        {product.mrp}
                                    </span>
                                )}
                            </td>
                            <td>
                                {editProductId === product.id && editField.hasOwnProperty('sellingPrice') ? (
                                    <input
                                        type="number"
                                        value={editField.sellingPrice}
                                        ref={inputRef}
                                        onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                                        onBlur={() => confirmUpdate(product.id, 'sellingPrice', parseFloat(editField.sellingPrice))}
                                        onKeyDown={(e) => handleKeyDown(e, product.id, 'sellingPrice', parseFloat(editField.sellingPrice))}
                                    />
                                ) : (
                                    <span onDoubleClick={() => startEditing(product.id, 'sellingPrice', product.sellingPrice)}>
                                        {product.sellingPrice}
                                    </span>
                                )}
                            </td>
                            <td>
                                {editProductId === product.id && editField.hasOwnProperty('description') ? (
                                    <input
                                        type="text"
                                        value={editField.description}
                                        ref={inputRef}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        onBlur={() => confirmUpdate(product.id, 'description', editField.description)}
                                        onKeyDown={(e) => handleKeyDown(e, product.id, 'description', editField.description)}
                                    />
                                ) : (
                                    <span onDoubleClick={() => startEditing(product.id, 'description', product.description)}>
                                        {product.description}
                                    </span>
                                )}
                            </td>
                            <td>
                                {editProductId === product.id && editField.hasOwnProperty('sizes') ? (
                                    <input
                                        type="text"
                                        value={editField.sizes}
                                        ref={inputRef}
                                        onChange={(e) => handleInputChange('sizes', e.target.value)}
                                        onBlur={() => confirmUpdate(product.id, 'sizes', editField.sizes.split(',').map(item => item.trim()))}
                                        onKeyDown={(e) => handleKeyDown(e, product.id, 'sizes', editField.sizes.split(',').map(item => item.trim()))}
                                    />
                                ) : (
                                    <span onDoubleClick={() => startEditing(product.id, 'sizes', product.sizes.join(', '))}>
                                        {product.sizes.join(', ')}
                                    </span>
                                )}
                            </td>
                            <td>
                                {editProductId === product.id && editField.hasOwnProperty('variant') ? (
                                    <input
                                        type="text"
                                        value={editField.variant}
                                        ref={inputRef}
                                        onChange={(e) => handleInputChange('variant', e.target.value)}
                                        onBlur={() => confirmUpdate(product.id, 'variant', editField.variant)}
                                        onKeyDown={(e) => handleKeyDown(e, product.id, 'variant', editField.variant)}
                                    />
                                ) : (
                                    <span onDoubleClick={() => startEditing(product.id, 'variant', product.variant)}>
                                        {product.variant}
                                    </span>
                                )}
                            </td>
                            <td>
                                <button onClick={() => confirmDelete(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showConfirm && (
                <ConfirmationModal
                    message="Are you sure you want to proceed?"
                    onConfirm={confirmAction}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    );
};

export default ProductsList;
