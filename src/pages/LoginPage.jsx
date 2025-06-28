// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Optional CSS file for styling
import RegisterPage from './RegisterPage';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
      console.log('Login successful');
      console.log('User role:', user.role); // Log the user's role to verify

      // Store logged-in user data in localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(user));

      // Check if the role is correctly assigned and perform the correct navigation
      if (user.role === 'admin') {
        console.log('Redirecting to /admin');
        navigate('/admin'); // Redirect to admin dashboard
      } else if (user.role === 'executive') {
        console.log('Redirecting to /executive');
        navigate('/executive'); // Redirect to executive dashboard
      } else if (user.role === 'officer') {
        console.log('Redirecting to /officer');
        navigate('/officer'); // Redirect to officer dashboard
      } else if (user.role === 'worker') {
        console.log('Redirecting to /worker');
        navigate('/worker'); // Redirect to worker dashboard
      }
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
      
    </div>
  );
};

export default LoginPage;
