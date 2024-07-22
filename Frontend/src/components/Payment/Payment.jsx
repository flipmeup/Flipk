import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentNav from '../PaymentNav/PaymentNav';
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button from react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './Payment.css';
import apiUrl from '../../config';

const Payment = () => {
    const location = useLocation();
    const { product } = location.state || {};

    const [seconds, setSeconds] = useState(270); // Initial timer value in seconds (4 minutes 30 seconds)
    const [selectedPayment, setSelectedPayment] = useState(null); // State to track selected payment option
    const [upiData, setUpiData] = useState(null); // State to store UPI data
    const [paymentOptions, setPaymentOptions] = useState({}); // State to store payment options
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    // Fetch UPI data on component mount
    useEffect(() => {
        const fetchUpiData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/upi`);
                const data = await response.json();
                setUpiData(data[0]); // Assuming the response contains an array with one object
                setPaymentOptions(data[0].payment_options); // Set payment options directly from the response
            } catch (error) {
                console.error('Error fetching UPI data:', error);
            }
        };

        fetchUpiData();
    }, []);

    // Timer countdown logic
    useEffect(() => {
        const timer = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prevSeconds => prevSeconds - 1);
            }
        }, 1000);

        // Clear interval on component unmount or if seconds reach 0
        return () => clearInterval(timer);
    }, [seconds]);

    // Function to handle payment option selection and open modal
    const handlePaymentSelection = (paymentType) => {
        setSelectedPayment(paymentType);
        setShowModal(true); // Show modal when payment option is selected
    };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setShowModal(false); // Close modal function
    };

    // Function to handle payment and open the corresponding app
    const handlePayment = () => {
        if (!upiData) {
            console.log('UPI data not available');
            return;
        }

        let paymentLink = '';
        let amount = product.sellingPrice; // Use sellingPrice from product

        switch (selectedPayment) {
            case 'phonepe':
                // Construct PhonePe payment link using UPI data
                paymentLink = `phonepe://pay?pa=${upiData.upi_id}&pn=${upiData.upi_name}&am=${amount}&cu=INR`;
                break;
            case 'bhim_upi':
                // Construct BHIM UPI payment link using UPI data
                paymentLink = `upi://pay?pa=${upiData.upi_id}&pn=${upiData.upi_name}&am=${amount}&cu=INR`;
                break;
            case 'google_pay':
                // Construct Google Pay payment link using UPI data
                paymentLink = `https://pay.google.com/gp/p/ui/pay?pa=${upiData.upi_id}&pn=${upiData.upi_name}&am=${amount}&cu=INR`;
                break;
            case 'upi':
                // Construct a generic UPI payment link using UPI data
                paymentLink = `upi://pay?pa=${upiData.upi_id}&pn=${upiData.upi_name}&am=${amount}&cu=INR`;
                break;
            default:
                console.log('Select a payment method');
                break;
        }

        // Perform action based on payment method (open app or process payment)
        if (paymentLink !== '') {
            window.open(paymentLink, '_self'); // Open payment app in a new tab
        } else {
            console.log('Select a payment method');
        }
    };

    if (!product) {
        return <div></div>;
    }

    return (
        <div>
            <PaymentNav title={"Payments"} />
            <div className="card pt-3">
                {/* Timer Section */}
                <div className="card py-1 my-1">
                    <div className="py-2 px-3">
                        <div className="container-fluid px-0 offerend-container">
                            <h4>
                                {' '}
                                Offer ends in{' '}
                                <span className="offer-timer" id="offerend-time">
                                    {Math.floor(seconds / 60)}min {seconds % 60}sec
                                </span>
                            </h4>
                        </div>
                        {paymentOptions.divphonepe && (
                            <div
                                id="divphonepe"
                                className={`form-check available-method my-2 ${
                                    selectedPayment === 'phonepe' ? 'active' : ''
                                }`}
                                onClick={() => handlePaymentSelection('phonepe')}
                            >
                                <label className="form-check-label">
                                    {/* PhonePe icon and text */}
                                    <svg
                                        height="30"
                                        viewBox="0 0 700 700"
                                        width="30"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle
                                            cx="339.53"
                                            cy="339.53"
                                            fill="#5f259f"
                                            r="339.46"
                                        ></circle>
                                        <path
                                            d="m493.6 250.94c0-13.27-11.38-24.65-24.65-24.65h-45.51l-104.3-119.47c-9.48-11.38-24.65-15.17-39.82-11.38l-36.03 11.38c-5.69 1.9-7.59 9.48-3.79 13.27l113.78 108.1h-172.59c-5.69 0-9.48 3.79-9.48 9.48v18.96c0 13.27 11.38 24.65 24.65 24.65h26.55v91.03c0 68.27 36.03 108.1 96.72 108.1 18.96 0 34.14-1.9 53.1-9.48v60.69c0 17.07 13.27 30.34 30.34 30.34h26.55c5.69 0 11.38-5.69 11.38-11.38v-271.19h43.62c5.69 0 9.48-3.79 9.48-9.48zm-121.37 163.09c-11.38 5.69-26.55 7.59-37.93 7.59-30.34 0-45.51-15.17-45.51-49.31v-91.03h83.44z"
                                            fill="#fff"
                                        ></path>
                                    </svg>
                                    <span className="unaviablee">PhonePe</span>
                                </label>
                            </div>
                        )}
                        {paymentOptions.divbhimupi && (
                            <div
                                id="divbhimupi"
                                className={`form-check available-method my-2 ${
                                    selectedPayment === 'bhim_upi' ? 'active' : ''
                                }`}
                                onClick={() => handlePaymentSelection('bhim_upi')}
                            >
                                <label className="form-check-label">
                                    {/* BHIM UPI icon and text */}
                                    <img
                                        src="/assets/payments/bhim.webp"
                                        className="pay-logo"
                                        alt="button"
                                    />
                                    <span className="unaviablee mx-4">BHIM UPI</span>
                                </label>
                            </div>
                        )}
                        {paymentOptions.divgooglepay && (
                            <div
                                id="divgooglepay"
                                className={`form-check available-method my-2 ${
                                    selectedPayment === 'google_pay' ? 'active' : ''
                                }`}
                                onClick={() => handlePaymentSelection('google_pay')}
                            >
                                <label className="form-check-label">
                                    {/* Google Pay icon and text */}
                                    <img
                                        src="/assets/payments/googlepay.png"
                                        className="pay-logo"
                                        alt="button"
                                    />
                                    <span className="unaviablee mx-4">Google Pay</span>
                                </label>
                            </div>
                        )}
                        {paymentOptions.divupi && (
                            <div
                                id="divupi"
                                className={`form-check available-method my-2 ${
                                    selectedPayment === 'upi' ? 'active' : ''
                                }`}
                                onClick={() => handlePaymentSelection('upi')}
                            >
                                <label className="form-check-label">
                                    {/* UPI icon and text */}
                                    <img
                                        src="/assets/payments/qr.png"
                                        className="pay-logo"
                                        alt="button"
                                    />
                                    <span className="unaviablee mx-4">QR</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Price Details Section */}
                <div className="card px-3 py-4 mb-8" id="price-detail">
                    <h3>Price Details</h3>
                    <div className="price-detail-div mt-2">
                        <div className="product-price-list my-3">
                            <span className="title">Price (1 item)</span>
                            <span className="data selling_price me-0 td-none">
                                ₹ {product.sellingPrice}
                            </span>
                        </div>
                        <div className="product-price-list my-3">
                            <span className="title">Delivery Charges</span>
                            <span className="data text-success">FREE </span>
                        </div>
                        <div className="product-price-list mt-3 pt-3 total">
                            <span className="title">Amount Payable</span>
                            <span className="data selling_price">
                                ₹ {product.sellingPrice}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Modal Section */}
                <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    centered // Center the modal
                    dialogClassName="custom-modal" // Add custom class for styling
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Payment QR Code</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img
                            src="/assets/payments/qr.png"
                            alt="QR Code"
                            style={{ width: '100%' }}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Button Section */}
                <div className="button-container flex p-3 bg-white">
                    <div className="col-6 footer-price">
                        <span className="strike mrp ms-0 mb-1" id="mrp">
                            ₹ {product.mrp}
                        </span>
                        <span className="selling_price" id="selling_price">
                            ₹ {product.sellingPrice}
                        </span>
                    </div>
                    <button
                        onClick={handlePayment}
                        className="buynow-button product-page-buy col-6 btn-continue text-center"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;

