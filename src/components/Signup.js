// SignupForm.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { Link } from 'react-router-dom';
import '../App.css';

const backendLink = process.env.REACT_APP_BACKEND_LINK;

function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    otp: '',
    fileLink: ''
  });

  const [notification, setNotification] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [idProof, setIdProof] = useState(null);

  // Firebase Phone OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
  
  // SMS OTP via Firebase
  // Configure reCAPTCHA verifier
  const setupRecaptcha = () => {
    if (auth) {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
            console.log('recaptcha resolved..')
        }
    });
      return recaptchaVerifier;
    } else {
      console.error('Auth object is undefined.');
      return null;
    }
  };
  

  const PhSendOtp = async () => {
    try {
      const appVerifier = setupRecaptcha();
      if (!appVerifier) {
        throw new Error('Recaptcha setup failed. Please try again.');
      }
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmationResult);
      setNotification('OTP sent to your phone number!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setNotification('Error sending OTP. Please try again.');
    }
  };
  

  const PhVerifyOtp = async () => {
    try {
      const result = await confirmationResult.confirm(verificationCode);
      console.log('User signed in successfully:', result.user);
      setNotification('Phone number verified successfully!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setNotification('Error verifying OTP. Please try again.');
    }
  };

  /********************************************************************************/
  // Send Email OTP
  const sendOtp = async () => {
    try {
      const response = await axios.post(`${backendLink}/users/send-otp`, { email: formData.email }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('OTP sent:', response.data);
      setNotification('OTP has been sent to your email.');
      setOtpSent(true);
    } catch (error) {
      console.log('Error sending OTP:', error);
      setNotification(error.response.data.message);
    }
  };

  // Handle OTP verification
  const verifyOtp = async () => {
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
    }
  };

  /********************************************************************************/
  // Handle file upload
  const uploadFile = async () => {
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
        fileLink: response.data.fileUrl, // Assuming response contains fileUrl
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      setNotification('Error uploading file. Please try again.');
    }
  };

  /********************************************************************************/
  return (
    <>
      <div className="d-flex justify-content-center align-items-center mt-n5">
        <div className="container bg-success py-4 px-3 m-4 rounded">
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
                <label htmlFor="idProof" className="form-label text-white">Upload ID Proof</label>
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
              
              <div className="mt-3" id="recaptcha-container"></div>
                <div className="mt-3">
                  <label htmlFor="phoneNumber" className="form-label text-white">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    className="form-control"
                    placeholder="+911234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <button type="button" className="btn btn-primary mt-2" onClick={PhSendOtp}>
                    Send OTP
                  </button>
                </div>
            {confirmationResult && (
              <div className="mt-3">
                <label htmlFor="verificationCode" className="form-label text-white">Verification Code</label>
                <input
                  type="text"
                  id="verificationCode"
                  className="form-control"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <button type="button" className="btn btn-primary mt-2" onClick={PhVerifyOtp}>
                  Verify OTP
                </button>
                {notification && <p>{notification}</p>}
              </div>
            )} 
            <button type="submit" className="btn btn-warning mt-2">
              Sign Up
            </button>
           <div className="text-white py-4">{notification && <p>{notification}</p>}</div> 
          </form>
        </div>
      </div>
    </>
  );
}

export default SignupForm;
