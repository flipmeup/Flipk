import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './AdminPanel.css';
import apiUrl from '../../config'


const AddProductForm = () => {
    const [productData, setProductData] = useState({
        id: '',
        image: '',
        name: '',
        mrp: '',
        sellingPrice: '',
        assuredImage: '/assets/logo/assured.png',
        description: '',
        sizes: [],
        variant: '',
        carousel_images: [],
        colors: []
    });

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const [products, setProducts] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const mrp = parseFloat(productData.mrp);
        const sellingPrice = parseFloat(productData.sellingPrice);

        if (isNaN(mrp) || isNaN(sellingPrice)) {
            alert('Please enter valid numeric values for MRP and Selling Price.');
            return;
        }

        const newProductId = products.length + 1; // Calculate the new ID here

        const newProduct = {
            ...productData,
            id: newProductId, // Assign the calculated new ID
            mrp: mrp,
            sellingPrice: sellingPrice
        };

        try {
            const response = await axios.post(`${apiUrl}/api/products`, newProduct);
            console.log('Product added:', response.data);

            // Clear the form after successful submission
            setProductData({
                id: '',
                image: '',
                name: '',
                mrp: '',
                sellingPrice: '',
                assuredImage: '/assets/logo/assured.png',
                description: '',
                sizes: [],
                variant: '',
                carousel_images: [],
                colors: []
            });

            // Fetch updated products after adding new product
            fetchProducts();

            alert('Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'assuredImage') {
            return;
        }

        setProductData(prevData => ({
            ...prevData,
            [name]: name === 'sizes' || name === 'carousel_images' ? value.split(',').map(item => item.trim()) : value
        }));
    };

    const handleDescriptionChange = (event, editor) => {
        const data = editor.getData();
        setProductData(prevData => ({
            ...prevData,
            description: data
        }));
    };

    const handleColorChange = (e, index) => {
        const { name, value } = e.target;

        const updatedColors = [...productData.colors];
        updatedColors[index] = {
            ...updatedColors[index],
            [name]: value
        };

        setProductData(prevData => ({
            ...prevData,
            colors: updatedColors
        }));
    };

    const addColorOption = () => {
        setProductData(prevData => ({
            ...prevData,
            colors: [...prevData.colors, { name: '', image: '' }]
        }));
    };

    const removeColorOption = (index) => {
        const updatedColors = [...productData.colors];
        updatedColors.splice(index, 1);
        setProductData(prevData => ({
            ...prevData,
            colors: updatedColors
        }));
    };

    return (
        <div className="add-product-form">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Image URL:</label>
                    <input
                        type="text"
                        name="image"
                        value={productData.image}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>MRP:</label>
                        <input
                            type="text"
                            name="mrp"
                            value={productData.mrp}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label>Selling Price:</label>
                        <input
                            type="text"
                            name="sellingPrice"
                            value={productData.sellingPrice}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={productData.description}
                        onChange={handleDescriptionChange}
                        config={{
                            height: '400px'
                        }}
                        required
                    />
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col">
                            <label>Variant:</label>
                            <input
                                type="text"
                                name="variant"
                                value={productData.variant}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="col">
                            <label>Variant-Type:</label>
                            <input
                                type="text"
                                name="sizes"
                                value={productData.sizes.join(', ')}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Carousel Images (comma-separated URLs):</label>
                    <input
                        type="text"
                        name="carousel_images"
                        value={productData.carousel_images.join(', ')}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="color-options">
                    <h3>Color Options - Add Variant</h3>
                    {productData.colors.map((color, index) => (
                        <div key={index} className="color-option">
                            <div className="form-group">
                                <label>Color Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={color.name}
                                    onChange={(e) => handleColorChange(e, index)}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Color Image URL:</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={color.image}
                                    onChange={(e) => handleColorChange(e, index)}
                                    className="form-control"
                                />
                            </div>
                            <button type="button" onClick={() => removeColorOption(index)} className="btn btn-danger">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addColorOption} className="btn btn-primary">Add Color Option</button>
                </div>
                <div className="text-center mt-3">
                    <button type="submit" className="btn btn-success">Add Product</button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;
