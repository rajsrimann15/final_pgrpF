import React, { useEffect, useState } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const backendLink = process.env.REACT_APP_BACKEND_LINK;

//Map for admin Zone
const adminToZoneMap = {
    'admin_001': 'south',
    'admin_002': 'north',
};


function AdminDashboard() {

    const {admin, adminLogout } = useAdminAuth(); // Access the user context
    const history = useHistory();
    const [complaints, setComplaints] = useState([]);
    const accessToken = localStorage.getItem('accessToken');
    const [notification, setNotification] = useState('');

    // Redirect to login if the admin is not authenticated
    useEffect(() => {
        if (!admin) {
            history.push('/admin-login');
        }
    }, [admin, history]);

     // Get the zone based on the admin
    useEffect(() => {

        const zone = adminToZoneMap[admin.adminId];
        if (!zone) {
            console.error('Invalid admin identifier');
            return;
        }

        const fetchComplaints = async () => {
          try {
            const response = await axios.get(`${backendLink}/admin/${zone}`, {
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
      }, [admin,accessToken,backendLink,history]);
    
      //Status change
      const handleStatusChange = async (complaintId, newStatus) => {
        try {
           await axios.put(`${backendLink}/admin/${complaintId}`, {
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setNotification({ message: `Status updated to ${newStatus}`, complaintId });
            
        } catch (error) {
            console.error('Error updating complaint status:', error);
            setNotification('Status not udpdated');
        }
    };
    
    //logout
    const handleLogout = () => {
        adminLogout(); // Call the logout function from context
        history.push('/admin-login'); // Redirect to admin-login page
    };

    
    return (
        <>
                <button className="btn btn-secondary mb-3" onClick={handleLogout}>Logout</button>
                 <h3 className="text-center text-black">Complaint History</h3>
                <div className="table-responsive px-4">
                <h4>Zone: {adminToZoneMap[admin.adminId]}</h4>
                    <table className="table table-bordered table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Complaint Id</th>
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
                        <td>{complaint._id}</td>
                        <td>{complaint.title}</td>
                        <td>{complaint.location}</td>
                        <td>{complaint.shortDescription}</td>
                        <td>{complaint.longDescription}</td>
                        <td>{complaint.sector}</td>
                        <td>{complaint.status}
                            <select
                                name={`status-${complaint._id}`}
                                id={`status-${complaint._id}`}
                                required
                                defaultValue="Update the status">
                                <option value="Update the status" disabled>Update the status</option>
                                <option value="In Process">In Process</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <button
                                type="button"
                                className="btn btn-primary m-3 mt-2 px-4"
                                onClick={() => handleStatusChange(complaint._id, document.getElementById(`status-${complaint._id}`).value)}
                            >
                                Send
                            </button>
                            {notification.complaintId === complaint._id && (
                                <div className="text-black py-4">
                                    <p>{notification.message}</p>
                                </div>
                            )}
                        </td>
                    </tr>
))}
                        </tbody>
                    </table>
                </div>
    </>
)};

export default AdminDashboard;