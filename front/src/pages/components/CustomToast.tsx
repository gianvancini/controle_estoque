// CustomToast.js
import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const CustomToast = ({ show, message, onClose, bg }) => {
    return (
        <ToastContainer position="bottom-end" className="p-3 mb-15">
            <Toast show={show} bg={bg} onClose={onClose} delay={3000} autohide>
                <Toast.Body style={{ color: 'white' }}>{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default CustomToast;