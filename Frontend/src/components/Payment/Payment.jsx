import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentNav from '../PaymentNav/PaymentNav';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Payment.css'; // Make sure this file contains the updated CSS
import apiUrl from '../../config';

const Payment = () => {
    const location = useLocation();
    const { product } = location.state || {};

    const [seconds, setSeconds] = useState(270);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [upiData, setUpiData] = useState(null);
    const [paymentOptions, setPaymentOptions] = useState({});
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchUpiData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/upi`);
                const data = await response.json();
                setUpiData(data[0]);
                setPaymentOptions(data[0].payment_options);
            } catch (error) {
                console.error('Error fetching UPI data:', error);
            }
        };

        fetchUpiData();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prevSeconds => prevSeconds - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);

    const handlePaymentSelection = (paymentType) => {
        setSelectedPayment(paymentType);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePayment = () => {
        if (!upiData) {
            console.log('UPI data not available');
            return;
        }

        // let amount = product.sellingPrice;

        switch (selectedPayment) {
            case 'phonepe':
                // Example payment link generation (removed setting paymentLink)
                console.log('PhonePe selected');
                break;
            case 'bhim_upi':
                // Example payment link generation (removed setting paymentLink)
                console.log('BHIM UPI selected');
                break;
            case 'google_pay':
                // Example payment link generation (removed setting paymentLink)
                console.log('Google Pay selected');
                break;
            case 'upi':
                // Example payment link generation (removed setting paymentLink)
                console.log('UPI selected');
                break;
            default:
                console.log('Select a payment method');
                break;
        }

        setShowModal(true);
    };

    if (!product) {
        return <div></div>;
    }

    return (
        <div>
            <PaymentNav title={"Payments"} />
            <div className="card pt-3">
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
                                    <img
                                        src="/assets/payments/qr.jpeg"
                                        className="pay-logo"
                                        alt="button"
                                    />
                                    <span className="unaviablee mx-4">QR</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

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
                        <div className="my-4 mx-0 text-center">
                            <button
                                onClick={handlePayment}
                                className="buynow-button product-page-buy col-6 btn-continue text-center"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered
                className="custom-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Payment Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex flex-column align-items-center">
            {/* Modal content here */}
            <img 
                src="assets/payments/qr.jpeg" 
                alt="QR Code" 
                style={{ width: '100%', maxWidth: '100%', height: 'auto' }}
            />
        </Modal.Body>
                 <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} style={{ padding: '8px 8px', backgroundColor: 'red', borderColor: 'red' }}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleCloseModal} className="btn-green" style={{ padding: '8px 8px', backgroundColor: 'green', borderColor: 'green' }}>
                Confirm Payment
            </Button>
        </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Payment;
