 import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ProductList.css';
import ConfirmationModal from './ConfirmationModal';
import apiUrl from '../../config';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);
    const [editField, setEditField] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');
    const formRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/products`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setEditProductId(null);
                setEditField({});
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [formRef]);

    const confirmUpdate = async (productId) => {
        try {
            console.log('Updating product with:', editField); // Log the editField object
            const updatedProduct = await axios.put(`${apiUrl}/api/products/${productId}`, editField);
            const updatedProducts = products.map(product => (
                product.id === productId ? updatedProduct.data : product
            ));
            setProducts(updatedProducts);
            setEditProductId(null);
            setEditField({});
            setShowConfirm(false); // Close the confirmation modal on successful update
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const confirmDelete = async (productId) => {
        try {
            await axios.delete(`${apiUrl}/api/products/${productId}`);
            const updatedProducts = products.filter(product => product.id !== productId);
            setProducts(updatedProducts);
            setShowConfirm(false); // Close the confirmation modal on successful delete
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const startEditing = (productId) => {
        setEditProductId(productId);
        const productToEdit = products.find(product => product.id === productId);
        // Ensure sizes is initialized as an array
        setEditField({
            ...productToEdit,
            sizes: Array.isArray(productToEdit.sizes) ? [...productToEdit.sizes] : []
        });
    };

    const handleInputChange = (event, field) => {
        const { value } = event.target;
        if (field.startsWith('carousel_images')) {
            const index = parseInt(field.split('[')[1].split(']')[0], 10);
            setEditField(prevState => {
                const updatedCarouselImages = [...prevState.carousel_images];
                updatedCarouselImages[index] = value;
                return {
                    ...prevState,
                    carousel_images: updatedCarouselImages
                };
            });
        } else if (field === 'sizes') {
            setEditField(prevState => ({
                ...prevState,
                sizes: value.split(',').map(item => item.trim())
            }));
        } else {
            setEditField(prevState => ({
                ...prevState,
                [field]: value
            }));
        }
    };
    

    const handleKeyDown = (event, productId) => {
        if (event.key === 'Enter') {
            openConfirmModal(productId);
        }
    };

    const handleColorChange = (event, idx, field) => {
        const { value } = event.target;
        setEditField(prevState => {
            const updatedColors = [...prevState.colors];
            updatedColors[idx] = {
                ...updatedColors[idx],
                [field]: value
            };
            return {
                ...prevState,
                colors: updatedColors
            };
        });
    };

    const openConfirmModal = (productId) => {
        setConfirmMessage('Are you sure you want to save these changes?');
        setConfirmAction(() => () => confirmUpdate(productId));
        setShowConfirm(true);
    };

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    return (
        <div className="products-list">
            <h2>All Products</h2>
            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <React.Fragment key={product.id}>
                            <tr>
                                <td>{index + 1}</td>
                                <td>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        height="50"
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>
                                    <button onClick={() => startEditing(product.id)}>Edit</button>
                                </td>
                                <td>
                                    <button onClick={() => {
                                        setConfirmMessage('Are you sure you want to delete this product?');
                                        setConfirmAction(() => () => confirmDelete(product.id));
                                        setShowConfirm(true);
                                    }}>Delete</button>
                                </td>
                            </tr>
                            {editProductId === product.id && (
                                <tr>
                                    <td colSpan="5" className="edit-row" onClick={stopPropagation}>
                                        <div ref={formRef}>
                                            <div>
                                                <label htmlFor={`image_${product.id}`}>Image URL:</label>
                                                <input
                                                    type="text"
                                                    id={`image_${product.id}`}
                                                    value={editField.image || ''}
                                                    onChange={(e) => handleInputChange(e, 'image')}
                                                    onKeyDown={(e) => handleKeyDown(e, product.id)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`mrp_${product.id}`}>MRP:</label>
                                                <input
                                                    type="number"
                                                    id={`mrp_${product.id}`}
                                                    value={editField.mrp || ''}
                                                    onChange={(e) => handleInputChange(e, 'mrp')}
                                                    onKeyDown={(e) => handleKeyDown(e, product.id)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`sellingPrice_${product.id}`}>Selling Price:</label>
                                                <input
                                                    type="number"
                                                    id={`sellingPrice_${product.id}`}
                                                    value={editField.sellingPrice || ''}
                                                    onChange={(e) => handleInputChange(e, 'sellingPrice')}
                                                    onKeyDown={(e) => handleKeyDown(e, product.id)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`sizes_${product.id}`}>Variant Type:</label>
                                                <input
                                                    type="text"
                                                    id={`sizes_${product.id}`}
                                                    value={editField.sizes ? editField.sizes.join(', ') : ''}
                                                    onChange={(e) => handleInputChange(e, 'sizes')}
                                                    onKeyDown={(e) => handleKeyDown(e, product.id)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`variant_${product.id}`}>Variant:</label>
                                                <input
                                                    type="text"
                                                    id={`variant_${product.id}`}
                                                    value={editField.variant || ''}
                                                    onChange={(e) => handleInputChange(e, 'variant')}
                                                    onKeyDown={(e) => handleKeyDown(e, product.id)}
                                                />
                                            </div>
                                            <div>
                                                <label id='c_image'>Carousel Images:</label>
                                                {editField.carousel_images && editField.carousel_images.map((image, idx) => (
                                                    <div key={`carousel_image_${idx}`}>
                                                        <label htmlFor={`carousel_image_${idx}`}>Image URL {idx + 1}:</label>
                                                        <input
                                                            type="text"
                                                            id={`carousel_image_${idx}`}
                                                            value={image || ''}
                                                            onChange={(e) => handleInputChange(e, `carousel_images[${idx}]`)}
                                                            onKeyDown={(e) => handleKeyDown(e, product.id)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                <label id='c_color'>Colors:</label>
                                                {editField.colors && editField.colors.map((color, idx) => (
                                                    <div key={`color_${idx}`}>
                                                        <label htmlFor={`color_name_${idx}`}>Color Name:</label>
                                                        <input
                                                            type="text"
                                                            id={`color_name_${idx}`}
                                                            value={color.name || ''}
                                                            onChange={(e) => handleColorChange(e, idx, 'name')}
                                                            onKeyDown={(e) => handleKeyDown(e, product.id)}
                                                        />
                                                        <label htmlFor={`color_image_${idx}`}>Color Image URL:</label>
                                                        <input
                                                            type="text"
                                                            id={`color_image_${idx}`}
                                                            value={color.image || ''}
                                                            onChange={(e) => handleColorChange(e, idx, 'image')}
                                                            onKeyDown={(e) => handleKeyDown(e, product.id)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => openConfirmModal(product.id)}>Save</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {showConfirm && (
                <ConfirmationModal
                    message={confirmMessage}
                    onConfirm={() => {
                        confirmAction();
                        setShowConfirm(false);
                    }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    );
};

export default ProductsList;