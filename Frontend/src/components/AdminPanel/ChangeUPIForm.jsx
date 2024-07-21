import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmationModal from './ConfirmationModal';

const ChangeUPIForm = ({ onClose }) => {
    const [upiData, setUpiData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editField, setEditField] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        const fetchUpiData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/upi');
                setUpiData(response.data);
            } catch (error) {
                console.error('Error fetching UPI data:', error);
            }
        };

        fetchUpiData();
    }, []);

    const startEditing = (id, field, value) => {
        setEditId(id);
        setEditField({ [field]: value });
    };

    const handleInputChange = (field, value) => {
        setEditField(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleCheckboxChange = (option, checked) => {
        setEditField(prevState => ({
            ...prevState,
            payment_options: {
                ...prevState.payment_options,
                [option]: checked
            }
        }));
    };

    const confirmUpdate = (id, field, value) => {
        setConfirmAction(() => () => handleUpdate(id, field, value));
        setShowConfirm(true);
    };

    const handleUpdate = async (id, field, value) => {
        setShowConfirm(false);
        setEditId(null);
        setEditField({});
        
        try {
            const updatedData = {
                [field]: value,
                upi_id: editField.upi_id || upiData.find(upi => upi._id === id).upi_id,
                upi_name: editField.upi_name || upiData.find(upi => upi._id === id).upi_name,
                payment_options: editField.payment_options || upiData.find(upi => upi._id === id).payment_options
            };

            const response = await axios.put(`http://localhost:3000/api/upi/${id}`, updatedData);
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

    const handleKeyDown = (event, id, field, value) => {
        if (event.key === 'Enter') {
            confirmUpdate(id, field, value);
        }
    };

    const confirmCancel = () => {
        setShowConfirm(false);
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
                                        value={editField.upi_id || upi.upi_id}
                                        onChange={(e) => handleInputChange('upi_id', e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, upi._id, 'upi_id', editField.upi_id || upi.upi_id)}
                                    />
                                ) : (
                                    <span onDoubleClick={() => startEditing(upi._id, 'upi_id', upi.upi_id)}>{upi.upi_id}</span>
                                )}
                            </td>
                            <td>
                                {editId === upi._id ? (
                                    <input
                                        type="text"
                                        value={editField.upi_name || upi.upi_name}
                                        onChange={(e) => handleInputChange('upi_name', e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, upi._id, 'upi_name', editField.upi_name || upi.upi_name)}
                                    />
                                ) : (
                                    <span onDoubleClick={() => startEditing(upi._id, 'upi_name', upi.upi_name)}>{upi.upi_name}</span>
                                )}
                            </td>
                            <td>
                                <div>
                                    <label>
                                        PhonePe:
                                        <input
                                            type="checkbox"
                                            checked={editField.payment_options?.divphonepe || upi.payment_options.divphonepe}
                                            onChange={(e) => handleCheckboxChange('divphonepe', e.target.checked)}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        BHIM UPI:
                                        <input
                                            type="checkbox"
                                            checked={editField.payment_options?.divbhimupi || upi.payment_options.divbhimupi}
                                            onChange={(e) => handleCheckboxChange('divbhimupi', e.target.checked)}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        Google Pay:
                                        <input
                                            type="checkbox"
                                            checked={editField.payment_options?.divgooglepay || upi.payment_options.divgooglepay}
                                            onChange={(e) => handleCheckboxChange('divgooglepay', e.target.checked)}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        UPI:
                                        <input
                                            type="checkbox"
                                            checked={editField.payment_options?.divupi || upi.payment_options.divupi}
                                            onChange={(e) => handleCheckboxChange('divupi', e.target.checked)}
                                        />
                                    </label>
                                </div>
                            </td>
                            <td>
                                {editId === upi._id && showConfirm && (
                                    <ConfirmationModal
                                        message="Are you sure you want to save?"
                                        onConfirm={confirmAction}
                                        onCancel={confirmCancel}
                                    />
                                )}
                                {editId === upi._id ? (
                                    <button onClick={() => confirmUpdate(upi._id, 'upi_id', editField.upi_id || upi.upi_id)}>Save</button>
                                ) : (
                                    <button onClick={() => startEditing(upi._id, 'upi_id', upi.upi_id)}>Edit</button>
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
