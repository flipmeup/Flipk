import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for HTTP requests
import './Products.css';
import apiUrl from '../../config'


const Products = () => {
    const [products, setProducts] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState(false); // State to track image loading

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/products`);
                setProducts(response.data);
                preloadImages(response.data); // Preload images once products are fetched
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const calculateDiscount = (mrp, sellingPrice) => {
        return ((mrp - sellingPrice) / mrp * 100).toFixed(1);
    };

    const deliveryMessage = 'Free delivery in 2 days';

    const preloadImages = (data) => {
        const imgPromises = data.map(product => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => {
                    console.error(`Error loading image for product ${product.id}`);
                    resolve(); // Resolve even if image fails to load
                };
                img.src = product.image;
            });
        });

        Promise.all(imgPromises)
            .then(() => setImagesLoaded(true)) // Set imagesLoaded to true after all images are loaded
            .catch((error) => console.error('Error preloading images:', error));
    };

    return (
        <div className='products'>
            {imagesLoaded && products.map(product => (
                <Link to={`/product-details/${product.id}`} className='plink' key={product.id}>
                    <div className='outerDiv'>
                        <div className='image'>
                            <img src={product.image} alt={product.name} onError={(e) => e.target.src = '/path/to/placeholder-image.jpg'} />
                        </div>
                        <div className='productName'>{product.name}</div>
                        <div className='discount'>
                            - {calculateDiscount(product.mrp, product.sellingPrice)}% Off
                            <span className='mrp'>₹{product.mrp}</span>
                        </div>
                        <div className='price'>
                            <b className='selling-price'>₹{product.sellingPrice}</b>
                            <img src={product.assuredImage} alt='assured' />
                        </div>
                        <button className='limitedDeal btn'>Limited Time Deal</button>
                        <div className='freedelivery'>{deliveryMessage}</div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default Products;
