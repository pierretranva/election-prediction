import React, { useState } from 'react';
import './App.css'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({username: username, password: password})
   
    
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
      <div style={{ textAlign: 'center' }}> {/* Center the button */}
        <Button color="inherit" component={Link} to="/register">
          Register here
        </Button>
      </div>
    </form>
  );
};

const LoginPage = (props) => {
  const [error, setError] = useState(null);
  const handleLogin = (credentials) => {
    // You can send a request to your backend for authentication here
    console.log('Logging in with credentials:', credentials);
    // Example: fetch('/login', { method: 'POST', body: JSON.stringify(credentials) })

   let res = axios.post("http://localhost:3000/db/user/login",{username: credentials.username, password: credentials.password} )

   res.then((response) => {
        console.log(response)
        props.signIn(response.data)
    })
    .catch((error) => {
        // console.log(error)
        setError("Invalid username or password")
    })
  };
  


  return (
    <div className="login-page">
        <div className="login-form">
            <h1>Login Page</h1>
            <LoginForm onSubmit={handleLogin} />
            <p>{error}</p>
        </div>
    </div>
  );
};

export default LoginPage;
