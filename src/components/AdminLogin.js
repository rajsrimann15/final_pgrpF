// Login.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import axios from 'axios';
import { Link,useHistory } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import '../App.css';

const backendLink = process.env.REACT_APP_BACKEND_LINK;

function LoginForm() {
  const [formData, setFormData] = useState({
    adminId: '',
    password: '',
  });

  const [notification, setNotification] = useState('');
  const history = useHistory();
  const { adminLogin } = useAdminAuth();

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
      const response = await axios.post(`${backendLink}/admin/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const adminData = response.data;
      console.log('Login successful!', adminData);

      // Store tokens in local storage
      localStorage.setItem('accessToken', adminData.accessToken);
      localStorage.setItem('refreshToken', adminData.refreshToken);
      
      setNotification('Login successful!');
      setFormData({ adminId: '', password: '' });
      adminLogin(adminData); // Set the login state to true
      history.push('/admin-dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      setNotification('Wrong credentials! Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-n5">
      <div className="container bg-success py-4 px-3 m-4 rounded shadow square-container">
      <Link to="/login" className="py-1 px-2 mt-5 text-white">User Login</Link>
        <h3 className="text-center text-white">ADMIN LOGIN</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control py-4 px-3 mt-5"
              placeholder="Admin Id"
              name="adminId"
              value={formData.adminId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
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
          <button type="submit" className="btn btn-warning mt-2">Login</button>
        </form>
        <div className="text-white py-4">{notification && <p>{notification}</p>}</div>
      </div>
    </div>
  );
}

export default LoginForm;

