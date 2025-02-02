// SignupForm.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';
import Loading from './Loading';
import { useAuth } from './AuthContext';
import { useHistory } from 'react-router-dom';
const backendLink = process.env.REACT_APP_BACKEND_LINK;


const Load =()=>{
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust the timeout duration as needed
  }, []);

  return (
    <div>
      {isLoading ? <Loading/> : < SignupForm/>}
    </div>
  );
};





const SignupForm=()=> {
  
  const { user} = useAuth(); // Access the user context
  const history = useHistory(); // Hook for navigation

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    fileLink: ''
  });

  const [notification, setNotification] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [idProof, setIdProof] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (user) {
            history.push('/home');
        }
    }, [user, history]);


  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //notification popup close 
    useEffect(() => {
      if (notification) {
          const timer = setTimeout(() => {
              setNotification('');
          }, 3000);
          // Clear the timeout if the component unmounts before the timeout completes
          return () => clearTimeout(timer);
      }
      }, [notification]);

  // handling id file change
  const handleFileChange = (e) => {
    setIdProof(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (!otpVerified) {
      setNotification('Please verify your OTP before creating an account.');
      return;
    }

    try {
      // Send POST request to the backend API
      const response = await axios.post(`${backendLink}/users/signup`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Signup successful:', response.data);

      setNotification(`Account created successfully! Your userID: ${response.data.user.userId}`); // Set success message

      // Clear form fields after successful signup
      setFormData({ name: '', email: '', password: '', address: '', otp: '', fileLink: '' });
      setOtpSent(false);
      setOtpVerified(false);
      setIdProof(null);
    } catch (error) {
      console.error('Error signing up:', error);
      setNotification('Error signing up. Please try again.'); // Set error message
    }
  };

  

  /********************************************************************************/
  // Send Email OTP
  const sendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${backendLink}/users/send-otp`, { email: formData.email }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setOtpSent(true);
      console.log('OTP sent:', response.data);
      setNotification('OTP has been sent to your email.');
      
    } catch (error) {
      console.log('Error sending OTP:', error);
      setNotification(error.response.data.message);
    }finally{
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const verifyOtp = async () => {
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${backendLink}/users/verify-otp`, { email: formData.email, otp: formData.otp }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        console.log('OTP verified:', response.data);
        setNotification('OTP verified successfully!');
        setOtpVerified(true);
      } else {
        setNotification('Wrong OTP. Please try again.');
        setOtpVerified(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setNotification('Wrong OTP. Please try again.');
      setOtpVerified(false);
    }finally{
      setIsLoading(false);
    }
  };

  /********************************************************************************/
  // Handle file upload
  const uploadFile = async () => {
    setIsLoading(true);
    if (!idProof) {
      setNotification('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('idProof', idProof);

    try {
      const response = await axios.post(`${backendLink}/users/upload-id-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded:', response.data);
      setNotification('File uploaded successfully!');

      setFormData((prevData) => ({
        ...prevData,
        fileLink: response.data.fileId, // Assuming response contains fileUrl
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      setNotification('Error uploading file. Please try again.');
    }finally{
      setIsLoading(false);
    }
  };

  ///loading popuop
  const loadingPopup = (
    <div className="custom-popup">
      <div className="spinner"></div>
      <p>Processing...</p>
    </div>
  );

  /********************************************************************************/
  return (
    <>
      <div className="d-flex justify-content-center align-items-center mt-n5">
        <div className="container gradient py-4 px-3 m-4 rounded">
          <Link to="/" className="py-1 px-2 mt-5 text-white">Back to Login</Link>
          <h3 className="text-center text-white">SIGNUP FORM</h3>
          <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label"></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label"></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="btn btn-warning mt-4" onClick={sendOtp}>
                  Verify Email
                </button>
              </div>
              {otpSent && (
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label"></label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    className="form-control"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                  <button type="button" className="btn btn-warning mt-2" onClick={verifyOtp}>
                    Verify OTP
                  </button>
                  {otpVerified && <span className="text-success mt-2">✔</span>}
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="address" className="form-label"></label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-control"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label"></label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="idProof" className="form-label text-white">Upload ID Proof - PDF only </label>
                <input
                  type="file"
                  id="idProof"
                  className="form-control"
                  onChange={handleFileChange}
                  
                />
                <button type="button" className="btn btn-warning mt-2" onClick={uploadFile}>
                  Upload File
                </button>
              </div>
            <button type="submit" className="btn btn-warning mt-2">
              Sign Up
            </button>
            {isLoading && loadingPopup}
           <div className="text-white py-4">{notification && (
                    <div className="notification-popup">
                        <div className="notification-content">
                            <span>{notification}</span>
                            <button onClick={() => setNotification('')} className="close-btn">×</button>
                        </div>
                    </div>
                )}
          </div> 
          </form>
        </div>
      </div>
    </>
  );
}

export default Load;
