import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';
import './AdminPanel.css';
import apiUrl from '../../config'


const ChangeUPIForm = ({ onClose }) => {
    const [upiData, setUpiData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editField, setEditField] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        const fetchUpiData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/upi`);
                setUpiData(response.data);
            } catch (error) {
                console.error('Error fetching UPI data:', error);
            }
        };

        fetchUpiData();
    }, []);

    useEffect(() => {
        if (editId) {
            const upi = upiData.find(upi => upi._id === editId);
            if (upi) {
                setEditField({
                    upi_id: upi.upi_id,
                    upi_name: upi.upi_name,
                    payment_options: { ...upi.payment_options }
                });
            }
        }
    }, [editId, upiData]);

    const startEditing = (id) => {
        const upi = upiData.find(upi => upi._id === id);
        if (upi) {
            setEditField({
                upi_id: upi.upi_id,
                upi_name: upi.upi_name,
                payment_options: { ...upi.payment_options }
            });
        }
        setEditId(id);
    };

    const handleInputChange = (field, value) => {
        setEditField(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const togglePaymentOption = (option) => {
        setEditField(prevState => ({
            ...prevState,
            payment_options: {
                ...prevState.payment_options,
                [option]: !prevState.payment_options[option]
            }
        }));
    };

    const confirmUpdate = (id) => {
        setConfirmAction(() => () => handleUpdate(id));
        setShowConfirm(true);
    };

    const handleUpdate = async (id) => {
        setShowConfirm(false);
        setEditId(null);

        try {
            const updatedData = {
                ...editField,
                payment_options: editField.payment_options
            };

            const response = await axios.put(`${apiUrl}/api/upi/${id}`, updatedData);
            const updatedUpi = response.data;

            const updatedUpiData = upiData.map(upi => {
                if (upi._id === updatedUpi._id) {
                    return updatedUpi;
                }
                return upi;
            });

            setUpiData(updatedUpiData);
        } catch (error) {
            console.error('Error updating UPI data:', error);
        }
    };

    const handleKeyDown = (event, id) => {
        if (event.key === 'Enter') {
            confirmUpdate(id);
        }
    };

    return (
        <div className="change-upi-form">
            <table className="upi-data-table">
                <thead>
                    <tr>
                        <th>UPI ID</th>
                        <th>UPI Name</th>
                        <th>Payment Options</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {upiData.map(upi => (
                        <tr key={upi._id}>
                            <td>
                                {editId === upi._id ? (
                                    <input
                                        type="text"
                                        value={editField.upi_id !== undefined ? editField.upi_id : upi.upi_id}
                                        onChange={(e) => handleInputChange('upi_id', e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, upi._id)}
                                    />
                                ) : (
                                    <span onDoubleClick={() => startEditing(upi._id)}>{upi.upi_id}</span>
                                )}
                            </td>
                            <td>
                                {editId === upi._id ? (
                                    <input
                                        type="text"
                                        value={editField.upi_name !== undefined ? editField.upi_name : upi.upi_name}
                                        onChange={(e) => handleInputChange('upi_name', e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, upi._id)}
                                    />
                                ) : (
                                    <span onDoubleClick={() => startEditing(upi._id)}>{upi.upi_name}</span>
                                )}
                            </td>
                            <td>
                                <div style={{maxWidth:'200px'}}>
                                    <button
                                        className={`active-${upi.payment_options?.divphonepe ? 'green' : 'red'}`}
                                        disabled={editId !== upi._id}
                                        onClick={() => togglePaymentOption('divphonepe')}
                                    >
                                        {upi.payment_options?.divphonepe ? 'PhonePe (Active)' : 'PhonePe (Inactive)'}
                                    </button>
                                    <button
                                        className={`active-${upi.payment_options?.divbhimupi ? 'green' : 'red'}`}
                                        disabled={editId !== upi._id}
                                        onClick={() => togglePaymentOption('divbhimupi')}
                                    >
                                        {upi.payment_options?.divbhimupi ? 'BHIM UPI (Active)' : 'BHIM UPI (Inactive)'}
                                    </button>
                                    <button
                                        className={`active-${upi.payment_options?.divgooglepay ? 'green' : 'red'}`}
                                        disabled={editId !== upi._id}
                                        onClick={() => togglePaymentOption('divgooglepay')}
                                    >
                                        {upi.payment_options?.divgooglepay ? 'Google Pay (Active)' : 'Google Pay (Inactive)'}
                                    </button>
                                    <button
                                        className={`active-${upi.payment_options?.divupi ? 'green' : 'red'}`}
                                        disabled={editId !== upi._id}
                                        onClick={() => togglePaymentOption('divupi')}
                                    >
                                        {upi.payment_options?.divupi ? 'UPI (Active)' : 'UPI (Inactive)'}
                                    </button>
                                </div>
                            </td>
                            <td>
                                {editId === upi._id && showConfirm && (
                                    <ConfirmationModal
                                        message="Are you sure you want to save?"
                                        onConfirm={confirmAction}
                                        onCancel={() => setShowConfirm(false)}
                                    />
                                )}
                                {editId === upi._id ? (
                                    <button onClick={() => confirmUpdate(upi._id)}>Save</button>
                                ) : (
                                    <button onClick={() => startEditing(upi._id)}>Edit</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChangeUPIForm;
