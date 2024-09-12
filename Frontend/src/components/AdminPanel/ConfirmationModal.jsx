import React from 'react';
import './ConfirmationModal.css'; // Import your ConfirmationModal.css file for styling

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <button onClick={onConfirm} id='confirm'>Confirm</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
