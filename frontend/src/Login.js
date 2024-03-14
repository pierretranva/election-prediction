import React, { useState } from 'react';
import './App.css'

const LoginForm = ({ onSubmit }) => {
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
      <button type="submit">Login</button>
    </form>
  );
};

const LoginPage = () => {
  const handleLogin = (credentials) => {
    // You can send a request to your backend for authentication here
    console.log('Logging in with credentials:', credentials);
    // Example: fetch('/login', { method: 'POST', body: JSON.stringify(credentials) })
    
  };

  return (
    <div className="login-page">
        <div className="login-form">
            <h1>Login Page</h1>
            <LoginForm onSubmit={handleLogin} />
        </div>
    </div>
  );
};

export default LoginPage;
