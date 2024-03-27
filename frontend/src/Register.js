import React, { useState } from 'react';
import './App.css'
import axios from 'axios';

const RegisterForm = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); 

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username: username, password: password, email: email });
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
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
};

const RegisterPage = (props) => {
  const handleRegister = (credentials) => {
    // You can send a request to your backend for authentication here
    console.log('Register with credentials:', credentials);
    // Example: fetch('/login', { method: 'POST', body: JSON.stringify(credentials) })
    axios({
        method: 'post',
        url: "http://localhost:3000/db/user/register",
        data: {username: credentials.username, password: credentials.password, email: credentials.email}
    })
    .then((response)=> {
        props.handleRegister(response.data);

    })
    
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