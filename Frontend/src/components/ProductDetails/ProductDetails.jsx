import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Carousel } from 'react-bootstrap';
import LoveIcon from '../Icons/LoveIcon';
import ShareIcon from '../Icons/ShareIcon';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activeSize, setActiveSize] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 30 });
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [sizeError, setSizeError] = useState(false);
    const [activeColor, setActiveColor] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/products/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product data');
                }
                const data = await response.json();
                console.log('Fetched product data:', data);
                setProduct(data);
                setActiveColor(data.colors[0]?.name); // Set the default active color
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                const seconds = prevTime.seconds > 0 ? prevTime.seconds - 1 : 59;
                const minutes = seconds === 59 ? prevTime.minutes - 1 : prevTime.minutes;
                return { minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (product?.carousel_images) {
            const loadImage = () => {
                const imgPromises = product.carousel_images.map((image) => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => resolve();
                        img.onerror = () => reject();
                        img.src = image;
                    });
                });

                Promise.all(imgPromises)
                    .then(() => setImagesLoaded(true))
                    .catch((error) => console.error('Error preloading images:', error));
            };

            loadImage();
        }
    }, [product]);

    const formatTime = () => {
        const { minutes, seconds } = timeLeft;
        return `${minutes}min ${seconds}sec`;
    };

    const handleSizeClick = (size) => {
        setActiveSize(size);
        setSizeError(false);
    };

    const handleColorClick = (color) => {
        setActiveColor(color);
    };

    const calculateDiscount = (mrp, sellingPrice) => {
        const discount = ((mrp - sellingPrice) / mrp) * 100;
        return discount.toFixed(2);
    };

    const renderSizeOptions = () => {
        return product?.sizes.map((size) => (
            <Badge
                key={size}
                pill
                bg={activeSize === size ? 'dark' : 'light'}
                text={activeSize === size ? 'light' : 'dark'}
                className="mx-1 px-3 py-2"
                style={{ boxShadow: 'rgba(5, 5, 5, 0.2) 0px 2px 8px 0px', borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => handleSizeClick(size)}
            >
                {size}
            </Badge>
        ));
    };

    const renderColorOptions = () => {
        return product?.colors.map((color) => (
            <div
                key={color.name}
                className={`color-item p-2 me-2 ${color.name} ${activeColor === color.name ? 'active' : ''}`}
                onClick={() => handleColorClick(color.name)}
            >
                <img src={color.image} alt={color.name} />
                <span className="color-name">{color.name}</span>
            </div>
        ));
    };

    const handleAddToCart = () => {
        if (!activeSize) {
            setSizeError(true);
            return;
        }
        navigate(`/address`, { state: { product: product, size: activeSize, color: activeColor } });
    };

    const handleBuyNow = () => {
        if (!activeSize) {
            setSizeError(true);
            return;
        }
        navigate(`/address`, { state: { product: product, size: activeSize, color: activeColor } });
    };

    return (
        <div>
            <nav>
                <div className='upper'>
                    <div className='leftNav'>
                        <Link to={'/'} className='no-underline'><i className="ri-arrow-left-line"></i></Link>
                        <img src="/assets/logo/logo.webp" alt='logo' />
                    </div>
                    <div className='rightNav'>
                        <span id='counter'>1</span>
                        <i className="ri-shopping-cart-2-fill"></i>
                    </div>
                </div>
            </nav>

            {imagesLoaded && (
                <div>
                    <div className="product-images-slider">
                        <div className="love-icon text-center">
                            <LoveIcon />
                        </div>
                        <div className="share-icon text-center">
                            <ShareIcon />
                        </div>
                        <Carousel>
                            {product?.carousel_images && product.carousel_images.map((image, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block"
                                        src={image}
                                        alt={`Product view ${index + 1}`}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                    
                    <div className="color-div container-fluid pb-3 card">
                        <h4 id='color'>Select Color</h4>
                        <div className="color-list p-2">
                            {renderColorOptions()}
                        </div>
                    </div>

                    <div className='container-fluid pb-3 card'>
                        <div className="product-title">{product?.variant}</div>
                        <div className="d-flex mt-3">
                            {renderSizeOptions()}
                        </div>
                        {sizeError && <div style={{ color: 'red', padding: '10px 0' }}>Please select this option before proceeding.</div>}
                        {product && (
                            <>
                                <div className="product-title-name">{product.name}</div>
                                <div className="product-price d-flex my-2">
                                    <span className="discount">{`${calculateDiscount(product.mrp, product.sellingPrice)}% off`}</span>
                                    <span className="mrp">₹{product.mrp}</span>
                                    <span className="price"> ₹{product.sellingPrice}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="container-fluid p-3 offerend-container my-1 card">
                        <h4 className="m-0">Offer ends in <span className="offer-timer" id="offerend-time">{formatTime()}</span></h4>
                    </div>
                    <div className="container-fluid p-3 mb-1 card"><img className="my-2" src="/assets/logo/pay-later.png" alt="pay-later" /></div>
                    <div className="container-fluid px-2 py-3 row feature-container product-extra ">
                        <div className="col-4 featured-item d-flex align-items-center flex-column bd-highlight px-1"><img className="featured-img mb-3" src="https://rukminim2.flixcart.com/www/150/50/prom
                    is/12/08/2021/d7e463af-de7d-4ae6-9cb1-9ce00ef63195.png?q=90" /><span className="feature-title"> 7 days Replacement </span></div>
                        <div className="col-4 featured-item d-flex align-items-center flex-column bd-highlight px-1"><img className="featured-img mb-3" src="https://rukminim2.flixcart.com/www/150/50/promos/12/08/2021/a7643ad9-1a53-46bf-a304-ae77b1414ef8.png?q=90" /><span className="feature-title"> No Cash On Delivery </span></div>
                        <div className="col-4 featured-item d-flex align-items-center flex-column bd-highlight px-1"><img className="featured-img mb-3 mt-1" src="https://rukminim2.flixcart.com/www/150/50/promos/07/06/2022/b83cee93-e815-4232-bba2-c209116588de.png?q=90 " /><span className="feature-title"> Plus (F-Assured) </span></div>
                    </div>
                    <div className='container-fluid product-detail px-3 py-3 pb-4 mb-4 card'>
                        <h3>Product Details</h3>
                        {product && <p className="Product-description">{product.description}</p>}
                    </div>

                    <div className="button-container d-flex">
                        <button className="buynow-button buynow-button-white product-page-buy" onClick={handleAddToCart}>Add to Cart</button>
                        <button className="buynow-button product-page-buy" onClick={handleBuyNow}>Buy Now</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Carousel } from 'react-bootstrap';
import LoveIcon from '../Icons/LoveIcon';
import ShareIcon from '../Icons/ShareIcon';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activeSize, setActiveSize] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 30 });
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [sizeError, setSizeError] = useState(false);
    const [activeColor, setActiveColor] = useState(null);


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product data');
                }
                const data = await response.json();
                console.log('Fetched product data:', data);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                const seconds = prevTime.seconds > 0 ? prevTime.seconds - 1 : 59;
                const minutes = seconds === 59 ? prevTime.minutes - 1 : prevTime.minutes;
                return { minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (product?.carousel_images) {
            const loadImage = () => {
                const imgPromises = product.carousel_images.map((image) => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => resolve();
                        img.onerror = () => reject();
                        img.src = image;
                    });
                });

                Promise.all(imgPromises)
                    .then(() => setImagesLoaded(true))
                    .catch((error) => console.error('Error preloading images:', error));
            };

            loadImage();
        }
    }, [product]);

    const formatTime = () => {
        const { minutes, seconds } = timeLeft;
        return `${minutes}min ${seconds}sec`;
    };

    const handleSizeClick = (size) => {
        setActiveSize(size);
        setSizeError(false);
    };
    const handleColorClick = (color) => {
        setActiveColor(color);
    };
    const calculateDiscount = (mrp, sellingPrice) => {
        const discount = ((mrp - sellingPrice) / mrp) * 100;
        return discount.toFixed(2);
    };
    const renderColorOptions = () => {
        return product?.colors.map((color) => (
            <div
                key={color.name}
                className={`color-item p-2 me-2 ${color.name} ${activeColor === color.name ? 'active' : ''}`}
                onClick={() => handleColorClick(color.name)}
            >
                <img src={color.image} alt={color.name} />
                <span className="color-name">{color.name}</span>
            </div>
        ));
    };

    const renderSizeOptions = () => {
        return product?.sizes.map((size) => (
            <Badge
                key={size}
                pill
                bg={activeSize === size ? 'dark' : 'light'}
                text={activeSize === size ? 'light' : 'dark'}
                className="mx-1 px-3 py-2"
                style={{ boxShadow: 'rgba(5, 5, 5, 0.2) 0px 2px 8px 0px', borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => handleSizeClick(size)}
            >
                {size}
            </Badge>
        ));
    };

    const handleAddToCart = () => {
        if (!activeSize) {
            setSizeError(true);
            return;
        }
        navigate(`/address`, { state: { product: product, size: activeSize, color: activeColor } });
    };

    const handleBuyNow = () => {
        if (!activeSize) {
            setSizeError(true);
            return;
        }
        navigate(`/address`, { state: { product: product, size: activeSize, color: activeColor } });
    };

    return (
        <div>
            <nav>
                <div className='upper'>
                    <div className='leftNav'>
                        <Link to={'/'} className='no-underline'><i className="ri-arrow-left-line"></i></Link>
                        <img src="/assets/logo/logo.webp" alt='logo' />
                    </div>
                    <div className='rightNav'>
                        <span id='counter'>1</span>
                        <i className="ri-shopping-cart-2-fill"></i>
                    </div>
                </div>
            </nav>

            {imagesLoaded && (
                <div>
                    <div className="product-images-slider">
                        <div className="love-icon text-center">
                            <LoveIcon />
                        </div>
                        <div className="share-icon text-center">
                            <ShareIcon />
                        </div>
                        <Carousel>
                            {product?.carousel_images && product.carousel_images.map((image, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block"
                                        src={image}
                                        alt={`Product view ${index + 1}`}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
 <div className="color-div container-fluid pb-3 card">
                        <h4 id='color'>Select Color</h4>
                        <div className="color-list p-2">
                            {renderColorOptions()}
                        </div>
                    </div>

                    <div className='container-fluid pb-3 card'>
                        <div className="product-title">{product?.variant}</div>
                        <div className="d-flex mt-3">
                            {renderSizeOptions()}
                        </div>
                        {sizeError && <div style={{ color: 'red', padding:'10px 0' }}>Please select this option before proceeding.</div>}
                        {product && (
                            <>
                                <div className="product-title-name">{product.name}</div>
                                <div className="product-price d-flex my-2">
                                    <span className="discount">{`${calculateDiscount(product.mrp, product.sellingPrice)}% off`}</span>
                                    <span className="mrp">₹{product.mrp}</span>
                                    <span className="price"> ₹{product.sellingPrice}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="container-fluid p-3 offerend-container my-1 card">
                        <h4 className="m-0">Offer ends in <span className="offer-timer" id="offerend-time">{formatTime()}</span></h4>
                    </div>
                    <div className="container-fluid p-3 mb-1 card"><img className="my-2" src="/assets/logo/pay-later.png" alt="pay-later" /></div>
                    <div className="container-fluid px-2 py-3 row feature-container product-extra ">
                        <div className="col-4 featured-item d-flex align-items-center flex-column bd-highlight px-1"><img className="featured-img mb-3" src="https://rukminim2.flixcart.com/www/150/50/promos/12/08/2021/d7e463af-de7d-4ae6-9cb1-9ce00ef63195.png?q=90" /><span className="feature-title"> 7 days Replacement </span></div><div className="col-4 featured-item d-flex align-items-center flex-column bd-highlight px-1"><img className="featured-img mb-3" src="https://rukminim2.flixcart.com/www/150/50/promos/12/08/2021/a7643ad9-1a53-46bf-a304-ae77b1414ef8.png?q=90" /><span className="feature-title"> No Cash On Delivery </span></div><div className="col-4 featured-item d-flex align-items-center flex-column bd-highlight px-1"><img className="featured-img mb-3 mt-1" src="https://rukminim2.flixcart.com/www/150/50/promos/07/06/2022/b83cee93-e815-4232-bba2-c209116588de.png?q=90 " /><span className="feature-title"> Plus (F-Assured) </span></div></div>
                    <div className='container-fluid product-detail px-3 py-3 pb-4 mb-4 card'>
                        <h3>Product Details</h3>
                        {product && <p className="Product-description">{product.description}</p>}
                    </div>

                    <div className="button-container d-flex">
                        <button className="buynow-button buynow-button-white product-page-buy" onClick={handleAddToCart}>Add to Cart</button>
                        <button className="buynow-button product-page-buy" onClick={handleBuyNow}>Buy Now</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
