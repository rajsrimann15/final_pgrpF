// Login.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../App.css';

const backendLink = process.env.REACT_APP_BACKEND_LINK;

function LoginForm() {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });

  const [notification, setNotification] = useState('');
  const history = useHistory();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendLink}/users/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const userData = response.data;
      console.log('Login successful!', userData);

      // Store tokens in local storage
      localStorage.setItem('accessToken', userData.accessToken);
      localStorage.setItem('refreshToken', userData.refreshToken);
      
      setNotification('Login successful!');
      setFormData({ userId: '', password: '' });
      login(userData); // Set the login state to true
      console.log(userData);
      history.push('/home');
    } catch (error) {
      console.error('Error logging in:', error);
      setNotification('Wrong credentials! Please try again.');
    }
  };

  return (
   <div className="d-flex justify-content-center align-items-center mt-n5">
      <div className="container bg-success py-4 px-3 m-4 rounded shadow square-container"> 
      <Link to="/admin-login" className="py-1 px-2 mt-5 text-white ">Admin Login</Link>
        <h3 className="text-center roboto-black white-text">LOGIN</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 px-5">
            <input
              type="text"
              className="form-control py-4 px-3 mt-5"
              placeholder="User Id"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 px-5">
            <input
              type="password"
              className="form-control py-4 px-3 mt-5"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-warning mt-2 mx-5">Login</button>
        </form>
        <div className="text-white py-4">{notification && <p>{notification}</p>}</div>
        <Link to="/signup" className="py-1 px-2 mt-5 text-white">Create an account?</Link>
      </div>
    </div>
  );
}

export default LoginForm;
