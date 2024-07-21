import React, { useState, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

const AddProductForm = () => {
    const [productData, setProductData] = useState({
        id: '',
        image: '',
        name: '',
        mrp: '',
        sellingPrice: '',
        assuredImage: '/assets/logo/assured.png',
        description: '', // Initial empty string
        sizes: [],
        variant: '',
        carousel_images: [],
        colors: [] // Initialize colors array for storing color options
    });

    const descriptionRef = useRef(null); // Reference for the description div

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { id, image, name, mrp, sellingPrice, assuredImage, sizes, variant, carousel_images, colors } = productData;

        // Validate required fields
        if (!image || !name || !mrp || !sellingPrice || !descriptionRef.current || colors.length === 0) {
            alert('Please fill out all required fields.');
            return;
        }

        // Convert mrp and sellingPrice to numbers
        const mrpNumber = parseFloat(mrp);
        const sellingPriceNumber = parseFloat(sellingPrice);

        if (isNaN(mrpNumber) || isNaN(sellingPriceNumber)) {
            alert('MRP and Selling Price must be valid numbers.');
            return;
        }

        try {
            // Convert description to image
            const canvas = await html2canvas(descriptionRef.current);
            const descriptionImage = canvas.toDataURL('image/png');

            // Construct new product object
            const newProduct = {
                id,
                image,
                name,
                mrp: mrpNumber,
                sellingPrice: sellingPriceNumber,
                assuredImage,
                description: descriptionImage, // Save the description image as a data URL
                sizes,
                variant,
                carousel_images,
                colors
            };

            // POST request to save product
            const response = await axios.post('https://flip-wind-a6dc.vercel.app/api/products', newProduct);
            console.log('Product added:', response.data);

            // Clear form fields after successful submission
            setProductData({
                id: '',
                image: '',
                name: '',
                mrp: '',
                sellingPrice: '',
                assuredImage: '/assets/logo/assured.png',
                description: '', // Reset description field
                sizes: [],
                variant: '',
                carousel_images: [],
                colors: []
            });

            alert('Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'sizes' || name === 'carousel_images') {
            // Handle sizes and carousel_images as arrays
            setProductData(prevData => ({
                ...prevData,
                [name]: value.split(',').map(item => item.trim()) // Convert comma-separated string to array
            }));
        } else {
            setProductData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleDescriptionChange = (e) => {
        setProductData({
            ...productData,
            description: e.target.innerHTML // Update description with innerHTML for contentEditable
        });
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
            <form onSubmit={handleSubmit}>
                <label>
                    Product ID:
                    <input
                        type="text"
                        name="id"
                        value={productData.id}
                        onChange={handleChange}
                        className="full-width-input"
                        required
                    />
                </label>
                <label>
                    Image URL:
                    <input
                        type="text"
                        name="image"
                        value={productData.image}
                        onChange={handleChange}
                        className="full-width-input"
                        required
                    />
                </label>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        className="full-width-input"
                        required
                    />
                </label>
                <label>
                    MRP:
                    <input
                        type="text"
                        name="mrp"
                        value={productData.mrp}
                        onChange={handleChange}
                        className="full-width-input"
                        required
                    />
                </label>
                <label>
                    Selling Price:
                    <input
                        type="text"
                        name="sellingPrice"
                        value={productData.sellingPrice}
                        onChange={handleChange}
                        className="full-width-input"
                        required
                    />
                </label>
                <label>
                    Assured Image URL:
                    <input
                        type="text"
                        name="assuredImage"
                        value={productData.assuredImage}
                        onChange={handleChange}
                        className="full-width-input"
                        disabled
                    />
                </label>
                <label>
                    Description:
                    <div
                        contentEditable
                        name="description"
                        className="description-input"
                        onBlur={handleDescriptionChange} // Use onBlur instead of onInput
                        style={{ border: '1px solid #ccc', minHeight: '100px', padding: '5px' }}
                        dangerouslySetInnerHTML={{ __html: productData.description }}
                        ref={descriptionRef} // Set the ref to the description div
                        required
                    />
                </label>
                <label>
                    Sizes (comma-separated):
                    <input
                        type="text"
                        name="sizes"
                        value={productData.sizes.join(', ')}
                        onChange={handleChange}
                        className="full-width-input"
                    />
                </label>
                <label>
                    Variant:
                    <input
                        type="text"
                        name="variant"
                        value={productData.variant}
                        onChange={handleChange}
                        className="full-width-input"
                        required
                    />
                </label>
                <label>
                    Carousel Images (comma-separated URLs):
                    <input
                        type="text"
                        name="carousel_images"
                        value={productData.carousel_images.join(', ')}
                        onChange={handleChange}
                        className="full-width-input"
                    />
                </label>
                <div className="color-options">
                    <h3>Color Options</h3>
                    {productData.colors.map((color, index) => (
                        <div key={index} className="color-option">
                            <label>
                                Color Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={color.name}
                                    onChange={(e) => handleColorChange(e, index)}
                                    className="color-name-input"
                                />
                            </label>
                            <label>
                                Color Image URL:
                                <input
                                    type="text"
                                    name="image"
                                    value={color.image}
                                    onChange={(e) => handleColorChange(e, index)}
                                    className="color-image-input"
                                />
                            </label>
                            <button type="button" onClick={() => removeColorOption(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addColorOption}>Add Color Option</button>
                </div>
                <button type="submit" className="submit-btn">Add Product</button>
            </form>
        </div>
    );
};

export default AddProductForm;
