import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentNav from '../PaymentNav/PaymentNav';
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

    // Fetch UPI data on component mount
    useEffect(() => {
        const fetchUpiData = async () => {
            try {
                const response = await fetch(${apiUrl}/api/upi);
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

    // Function to handle payment option selection
    const handlePaymentSelection = (paymentType) => {
        setSelectedPayment(paymentType);
    };

    // Function to handle payment and open the corresponding app
    const handlePayment = async () => {
        if (!upiData) {
            console.log('UPI data not available');
            return;
        }

        const siteName = 'Online Shopping';
        const { upi_id, upi_name } = upiData;
        const amount = parseFloat(product.sellingPrice).toFixed(2);
        const transactionId = 'H2MkMGf5olejI'; // Replace with actual transaction ID
        const merchantCode = '8931'; // Replace with actual merchant code
        const currency = 'INR';
        const note = siteName;
        const signature = 'AAuN7izDWN5cb8A5scnUiNME+LkZqI2DWgkXlN1McoP6WZABa/KkFTiLvuPRP6/nWK8BPg/rPhb+u4QMrUEX10UsANTDbJaALcSM9b8Wk218X+55T/zOzb7xoiB+BcX8yYuYayELImXJHIgL/c7nkAnHrwUCmbM97nRbCVVRvU0ku3Tr'; // Replace with actual signature

        let paymentLink = '';

        switch (selectedPayment) {
            case 'phonepe':
                paymentLink = phonepe://pay?pa=${upi_id}&pn=${upi_name}&am=${amount}&cu=${currency}&tr=${transactionId}&mc=${merchantCode}&tn=${note}&sign=${signature};
                break;
            case 'bhim_upi':
                paymentLink = upi://pay?pa=${upi_id}&pn=${upi_name}&am=${amount}&cu=${currency}&tr=${transactionId}&mc=${merchantCode}&tn=${note}&sign=${signature};
                break;
            case 'google_pay':
                if (window.PaymentRequest) {
                    const paymentRequest = new PaymentRequest([{
                        supportedMethods: ['https://tez.google.com/pay'],
                        data: {
                            pa: upi_id,
                            pn: upi_name,
                            tr: transactionId,
                            url: 'https://yourwebsite.com/order/1234ABCD',
                            mc: merchantCode,
                            tn: note
                        }
                    }], {
                        total: {
                            label: 'Total',
                            amount: {
                                currency: 'INR',
                                value: amount
                            }
                        },
                        displayItems: [{
                            label: 'Original Amount',
                            amount: {
                                currency: 'INR',
                                value: amount
                            }
                        }]
                    });

                    try {
                        const paymentResponse = await paymentRequest.show();
                        console.log('Payment successful:', paymentResponse);
                        paymentResponse.complete('success');
                        // Redirect to confirmation page or handle further logic
                    } catch (error) {
                        console.error('Payment failed:', error);
                    }
                } else {
                    console.log('Google Pay is not supported in this browser.');
                }
                return; // Prevent the default payment link handling for Google Pay
            case 'upi':
                paymentLink = paytmmp://pay?pa=${upi_id}&pn=${upi_name}&am=${amount}&cu=${currency}&tn=${transactionId}&mc=${merchantCode}&tn=${note}&sign=${signature};
                break;
            default:
                console.log('Select a payment method');
                break;
        }

        // Perform action based on payment method (open app or process payment)
        if (paymentLink !== '') {
            window.open(paymentLink, '_self'); // Open payment app in the same tab
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
                            <h4>Offer ends in <span className="offer-timer" id="offerend-time">
                                {Math.floor(seconds / 60)}min {seconds % 60}sec
                            </span></h4>
                        </div>
                        {paymentOptions.divphonepe && (
                            <div id="divphonepe" className={form-check available-method my-2 ${selectedPayment === 'phonepe' ? 'active' : ''}}
                                onClick={() => handlePaymentSelection('phonepe')}>
                                <label className="form-check-label">
                                    {/* PhonePe icon and text */}
                                    <svg height="30" viewBox="0 0 700 700" width="30" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="339.53" cy="339.53" fill="#5f259f" r="339.46"></circle>
                                        <path d="m493.6 250.94c0-13.27-11.38-24.65-24.65-24.65h-45.51l-104.3-119.47c-9.48-11.38-24.65-15.17-39.82-11.38l-36.03 11.38c-5.69 1.9-7.59 9.48-3.79 13.27l113.78 108.1h-172.59c-5.69 0-9.48 3.79-9.48 9.48v18.96c0 13.27 11.38 24.65 24.65 24.65h26.55v91.03c0 68.27 36.03 108.1 96.72 108.1 18.96 0 34.14-1.9 53.1-9.48v60.69c0 17.07 13.27 30.34 30.34 30.34h26.55c5.69 0 11.38-5.69 11.38-11.38v-271.19h43.62c5.69 0 9.48-3.79 9.48-9.48zm-121.37 163.09c-11.38 5.69-26.55 7.59-37.93 7.59-30.34 0-45.51-15.17-45.51-49.31v-91.03h83.44z" fill="#fff"></path>
                                    </svg>
                                    <span className="unaviablee">PhonePe</span>
                                </label>
                            </div>
                        )}
                        {paymentOptions.divbhimupi && (
                            <div id="divbhimupi" className={form-check available-method my-2 ${selectedPayment === 'bhim_upi' ? 'active' : ''}}
                                onClick={() => handlePaymentSelection('bhim_upi')}>
                                <label className="form-check-label">
                                    <img src="/assets/payments/bhimupi.png" className="pay-logo" alt="BHIM UPI" />
                                    <span className="mx-4">BHIM UPI</span>
                                </label>
                            </div>
                        )}
                        {paymentOptions.divupi && (
                            <div id="divupi" className={form-check available-method my-2 ${selectedPayment === 'upi' ? 'active' : ''}}
                                onClick={() => handlePaymentSelection('upi')}>
                                <label className="form-check-label">
                                    <img src="/assets/payments/upi.png" className="pay-logo" alt="UPI" />
                                    <span className="mx-4">UPI</span>
                                </label>
                            </div>
                        )}
                        {paymentOptions.divgooglepay && (
                            <div id="divgooglepay" className={form-check available-method my-2 ${selectedPayment === 'google_pay' ? 'active' : ''}}
                                onClick={() => handlePaymentSelection('google_pay')}>
                                <label className="form-check-label">
                                    <img src="/assets/payments/googlepay.png" className="pay-logo" alt="Google Pay" />
                                    <span className="mx-4">Google Pay</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Button Section */}
                <div className="button-container flex p-3 bg-white">
                    <div className="col-6 footer-price">
                        <span className="strike mrp ms-0 mb-1">₹ {product.mrp}</span>
                        <span className="selling_price">₹ {product.sellingPrice}</span>
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
