// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        const correctId = 'admin';
        const correctPassword = 'password';

        if (id === correctId && password === correctPassword) {
            setIsAuthenticated(true);
            navigate('/admin');
        } else {
            alert('Incorrect ID or Password');
        }
    };

    return (
        <div className="wrapper">
            <div className="login-container">
                <h1>Login</h1>
                <div>
                    <label>ID:</label>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="Enter your ID"
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default Login;
