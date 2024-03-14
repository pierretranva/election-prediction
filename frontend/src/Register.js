import React, { useState } from 'react';
import './App.css'

const RegisterForm = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
};

const RegisterPage = () => {
  const handleRegister = (credentials) => {
    // You can send a request to your backend for authentication here
    console.log('Register with credentials:', credentials);
    // Example: fetch('/login', { method: 'POST', body: JSON.stringify(credentials) })
    
  };

  return (
    <div className="login-page">
        <div className="login-form">
            <h1>Register Page</h1>
            <RegisterForm onSubmit={handleRegister} />
        </div>
    </div>
  );
};

export default RegisterPage;