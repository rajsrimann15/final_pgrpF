import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loading from './Loading';

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
      {isLoading ? <Loading/> : <ViewHistory/>}
    </div>
  );
};

const ViewHistory=()=> {

  const {user, logout } = useAuth();
  const history = useHistory();
  const [complaints, setComplaints] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${backendLink}/complaints/viewhistory`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        /*if (error.response && error.response.status === 401) {
          history.push('/login');
        }*/
      }
    };

    fetchComplaints();
  }, [accessToken, history]);


  useEffect(() => {
    if (!user) {
        history.push('/login');
    }
}, [user, history]);

 
const handleLogout = () => {
    logout(); // Call the logout function from context
    history.push('/login'); // Redirect to login page
};

const returnHome = () => {
    history.push('/home'); // Redirect to login page
};


  return (
    <>
        
        <button className="btn btn-success mx-3 my-3" onClick={returnHome}>Back to home</button>
            <h3 className="text-center text-black">Complaint History</h3>
            <div className="table-responsive px-4">
              <table className="table table-bordered table-striped">
                  <thead className="thead-dark">
                  <tr>
                      <th>Complaint Title</th>
                      <th>Complaint Location</th>
                      <th>Short Description</th>
                      <th>Long Description</th>
                      <th>Sector</th>
                      <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  {complaints.map((complaint) => (
                      <tr key={complaint._id}>
                      <td>{complaint.title}</td>
                      <td>{complaint.location}</td>
                      <td>{complaint.shortDescription}</td>
                      <td>{complaint.longDescription}</td>
                      <td>{complaint.sector}</td>
                      <td>{complaint.status}</td>
                      </tr>
                  ))}
                  </tbody>
              </table>
          </div>
    </>
  );
}

export default Load;
