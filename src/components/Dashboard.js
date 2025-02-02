import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';
import userIcon from "../img/dash_logo.svg";
const backendLink = process.env.REACT_APP_BACKEND_LINK;
const secretLink="sp=r&si=pgrb&sv=2022-11-02&sr=c&sig=%2F7BSOkRZbjtTMLOaNoY1Zr5VxN%2BEGnQAA%2FsM%2BOmAu0c%3D";



const Load =()=>{
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // Adjust the timeout duration as needed
    }, []);
  
    return (
      <div>
        {isLoading ? <Loading/> : < Dashboard/>}
      </div>
    );
  };


const Dashboard=()=> {

    const {user, logout } = useAuth(); // Access the user context
    const history = useHistory();
    const [userDetails, setUserDetails] = useState(null);

    // Redirect to login if the user is not authenticated
    useEffect(() => {
        if (!user) {
            history.push('/login');
        }
    }, [user, history]);

     //logout
    const handleLogout = () => {
        logout(); // Call the logout function from context
        history.push('/login'); // Redirect to login page
    };

    //back to home pg
    const returnHome = () => {
        history.push('/home'); // Redirect to login page
    };

    // get user details
    useEffect(() => {
        // Fetch user details from backend
        const accessToken = localStorage.getItem('accessToken');
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${backendLink}/users/details`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUserDetails(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
                // Handle error, e.g., redirect to login if unauthorized
                if (error.response && error.response.status === 401) {
                    logout();
                    history.push('/login');
                }
            }
        };

        fetchUserDetails();

    }, [history, logout]);
    
    return (
    <>
        <button className="btn btn-secondary mx-3 my-3" onClick={returnHome}>Back to home</button>
        <div className="d-flex justify-content-center align-items-center mt-n5">
            <div className="container gradient py-4 px-3 m-4 rounded shadow"> 
                <div className="text-center">
                    <img src={userIcon} alt="User Icon" className="rounded-circle mb-3" style={{ width: '100px', height: '100px' }} />
                    {userDetails && <h3 className="font-weight-bold text-white">{userDetails.name}</h3>}
                </div>
                <div className="row mt-4 mx-3 d-flex justify-content-center text-center">
                {userDetails ? (
                        <div className="col-md-4 my-4 rounded shadow bg-white">
                        <div className="table-responsive">
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <td className="card-text bg-transparent">User ID:</td>
                                        <td className="card-text bg-transparent">{userDetails.userId}</td>
                                    </tr>
                                    <tr>
                                        <td className="card-text bg-transparent">Email:</td>
                                        <td className="card-text bg-transparent">{userDetails.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="card-text bg-transparent">Address:</td>
                                        <td className="card-text bg-transparent">{userDetails.address}</td>
                                    </tr>
                                    <tr>
                                        <td className="card-text bg-transparent">Id Proof:</td>
                                        <td className="card-text bg-transparent">
                                            <a href={`${userDetails.fileLink}`}>View Here</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>            
                    ) : (
                        <p className="text-center text-white">Loading user details...</p>
                    )}
                </div>
                
            </div>
        </div>
    </>
)};

export default Load;