import 'bootstrap/dist/css/bootstrap.min.css';
import {GoogleGenerativeAI} from "@google/generative-ai";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { useAuth } from './AuthContext';
import { useHistory } from 'react-router-dom'; // Import useHistory for redirection
import Loading from './Loading';

const backendLink = process.env.REACT_APP_BACKEND_LINK;
const googleAPiKey= process.env.REACT_APP_GOOGLE_APIKEY;
const geminiApiKey=process.env.REACT_APP_GEMINI_APYKEY;
const accessToken = localStorage.getItem('accessToken');
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Load =()=>{
  const [isLoading, setIsLoading] = useState(true);

  
  //loading
  useEffect(() => {
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust the timeout duration as needed
  }, []);

  return (
    <div>
      {isLoading ? <Loading/> : <Demo/>}
    </div>
  );
};


const Demo= ()=> {
   
    const history = useHistory(); // Hook for navigation
    
    const [formData, setFormData] = useState({
        fileLink: '',
        location:'',
        shortDescription:'',
        longDescription:'',
        title:'',
        sector:'',
        zone:'',
    });
      
    const [notification, setNotification] = useState('');
    const [imgPr, setImgPr] = useState(null);
    const [location, setLocation] = useState('Getting location...');
    const [isLoading, setIsLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    


    // Handle form value change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle image file change
    const handleFileChange = (e) => {
        setImgPr(e.target.files[0]);
    };

    // Handle image upload
    const uploadFile = async () => {
        if (!imgPr) {
            setNotification('Please select the image first.');
            return;
        }
        setIsLoading(true);
        const fileData = new FormData();
        fileData.append('imgPr', imgPr);

        try {
            const response = await axios.post(`${backendLink}/demo/complaints/`, fileData, {
                headers: {  
                  'Content-Type': 'multipart/form-data',
                },
            });

            console.log('File uploaded:', response.data);
            setFormData((prevData) => ({
                ...prevData,
                fileLink: response.data.fileUrl, // Assuming response contains fileUrl
            }));
            
        } catch (error) {
            console.error('Error uploading file:', error);
            setNotification('Error uploading file. Please try again.');
            setIsLoading(false);
        }
    };


    // Call imgProcess only when fileLink is available
    useEffect(() => {
      if (formData.fileLink) {
          imgProcess(); 
      }
  }, [formData.fileLink]);

    
  useEffect(() => {
    if (notification) {
        const timer = setTimeout(() => {
            setNotification('');
        }, 3000);
        // Clear the timeout if the component unmounts before the timeout completes
        return () => clearTimeout(timer);
    }
    }, [notification]);
  
    // img process
    const imgProcess = async () => {
      try { 
          const response = await axios.post(`${backendLink}/demo/complaints/process`, { fileUrl:formData.fileLink }, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
      
            setFormData((prevData) => ({
              ...prevData,
              shortDescription: response.data.description
            }));
        
          } catch (error) {
            setNotification('Failed to process the image or Image is not related public grievance');
          }finally {
            setIsLoading(false); // Hide loading animation
          }
        };

    //long Decription{
    const longDescription=async ()=>{
      
      if (!formData.shortDescription) {
        setNotification('Please fill the Short Description.');
        return;
      }      
      setIsLoading(true);
      try {
        const response = await axios.post(`${backendLink}/demo/complaints/description`, {
            description: formData.shortDescription
        }, {
            headers: {  
              'Content-Type': 'application/json',
            },
        });
        setFormData((prevData) => ({
          ...prevData,
          longDescription: response.data.description

        }));

    } catch (error) {
      setNotification('Error. Please try again.');
    }finally{
      setIsLoading(false);
    }
    };
  

    // Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if(!formData.shortDescription && !formData.location) {
          setNotification('Some fields are missing');
        }
    
        try {
           // Retrieve access token from local storage

          setNotification('Complaint submitted successfully!');
          setFormData({
              fileLink: '',
              location: '',
              shortDescription: '',
              longDescription: '',
              title: '',
              sector: ''
          });
      } catch (error) {
          console.error('Error submitting complaint', error);
          setNotification('Error submitting complaint. Please try again.');
      }
    };

    //....................GeoCoding.............//
    //getLocation func call
     const getLocation = () => {
        setNotification('Not Available in Demo mode !');
        return;
      };

    //get Title
    const getTitle= async() =>{
     
      if (!formData.shortDescription) {
        setNotification('Please fill the above details !');
        return;
      }  

      setIsLoading(true);
      try {
        const response = await axios.post(`${backendLink}/demo/complaints/title`, {
            description: formData.shortDescription
        }, {
            headers: {  
              'Content-Type': 'application/json',
            },
        });
        setFormData((prevData) => ({
          ...prevData,
          title: response.data.title

        }));

    } catch (error) {
      setNotification('Error. Please try again.');
    }finally{
      setIsLoading(false);
    }
  };

  //get sector
  const getSector= async()=>{
    if (!formData.shortDescription) {
      setNotification('Please fill the above details !');
      return;
    } 
    setIsLoading(true);
    try {
        const response = await axios.post(`${backendLink}/demo/complaints/authority`, {
            title: formData.title
        }, {
            headers: {  
              'Content-Type': 'application/json',
            },
        });
        console.log(response.data.sector);
        setFormData((prevData) => ({
          ...prevData,
          sector: response.data.sector

        }));

    } catch (error) {
      setNotification('Error. Please try again.');
    }finally{
      setIsLoading(false);
    }
  };

  // get the Zone
  const getZone=async()=>{
      setNotification('Not Available in Demo mode !');
      return;
    };



  const loadingPopup = (
    <div className="custom-popup">
      <div className="spinner"></div>
      <p>Processing...</p>
    </div>
  );


  const returnLogin = () => {
    history.push('/login'); // Redirect to login page
};



    return ( 
        <>
            <button className="btn btn-secondary mx-3 my-3" onClick={returnLogin}>Back to Login Page</button>
            <div className="d-flex justify-content-center align-items-center mt-n5">
                <div className="container gradient py-4 px-3 m-4 rounded shadow">
                    <h3 className="text-center text-white">Register a New Complaint</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="imgPr" className="form-label text-white">Upload Image</label>
                            <input
                                type="file"
                                id="imgPr"
                                className="form-control"
                                onChange={handleFileChange}
                            />
                            <button type="button" className="btn btn-warning mt-2 mb-2" onClick={uploadFile}>
                                Image process
                            </button>
                            <textarea
                              type="text"
                              id="shortDescription"
                              name="shortDescription"
                              className="form-control"
                              placeholder="Short Description"
                              value={formData.shortDescription}
                              onChange={handleChange}
                              required
                              cols="25" rows="4"
                            />
                            <button type="button" className="btn btn-warning mt-2 mb-2 px-4" onClick={longDescription}>
                                Generate Long Description
                            </button>
                            <textarea
                              type="text"
                              id="longDescription"
                              name="longDescription"
                              className="form-control"
                              placeholder="Long Description"
                              value={formData.longDescription}
                              onChange={handleChange}
                              required
                              cols="25" rows="4"
                            />
                            <button type="button" className="btn btn-warning   mt-2 mb-2 px-4" onClick={getTitle}>
                               Get Title
                            </button>
                            <input
                              type="text"
                              id="title"
                              name="title"
                              className="form-control"
                              placeholder="title"
                              value={formData.title}
                              onChange={handleChange}
                              required
                            />
                            <button type="button" className="btn btn-warning  mt-2 mb-2 px-4" onClick={getLocation}>
                            Get Location
                            </button>
                            <input
                          type="text"
                          id="location"
                          name="location"
                          className="form-control"
                          placeholder="location"
                          value={formData.location}
                          onChange={handleChange}
                        />
                        <button type="button" className="btn btn-warning  mt-2 mb-2  px-4" onClick={getSector}>
                          Decide the sector
                        </button>
                        <select className='form-control' name="sector" id="sector" value={formData.sector} onChange={handleChange} required>
                          <option value="Select an option">Select a Sector</option>
                          <option value="Municipal Corporation/Urban Local Bodies (ULBs)">Municipal Corporation/Urban Local Bodies (ULBs)</option>
                          <option value="Public Works Department (PWD)"> Public Works Department (PWD)</option>
                          <option value="Animal Welfare Board(AWB)">Animal Welfare Board(AWB)</option>
                          <option value="Electricity Board">Electricity Board</option>
                          <option value="Water Supply Board">Water Supply Board</option>
                          <option value="Local Police Stations">Local Police Stations</option>
                          <option value="Resident Welfare Associations (RWAs)">Resident Welfare Associations (RWAs)</option>
                          <option value="Ward Councilors">Ward Councilors</option>
                          <option value="Local Elected Representatives">Local Elected Representatives]</option>
                        </select>
                        <button type="button" className="btn btn-warning mt-2 mb-2 px-4" onClick={getZone}>
                          Get the zone
                        </button>
                        <select className="mx-2" name="zone" id="zone" value={formData.zone} onChange={handleChange}>
                          <option value="Select an option">Select an option</option>
                          <option value="north">North</option>
                          <option value="south">South</option>
                          <option value="east">East</option>
                          <option value="west">West</option>
                        </select>
                        </div>
                        <button type="submit" className="btn btn-warning mt-2">Submit</button>
                    </form>
                    {isLoading && loadingPopup}
                    {notification && (
                    <div className="notification-popup">
                        <div className="notification-content">
                            <span>{notification}</span>
                            <button onClick={() => setNotification('')} className="close-btn">×</button>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Load;
