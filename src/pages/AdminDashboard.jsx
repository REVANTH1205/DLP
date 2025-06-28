import React, { useState } from 'react';
import axios from 'axios';
import './admin.css';
import UploadSection from '../components/UploadSection';
import FileList from '../components/FileList';
import AuditLogViewer from '../components/AuditLogViewer';
import AlertsViewer from '../components/AlertsViewer';

const AdminDashboard = () => {
  const [files, setFiles] = useState([]);
  

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const user = loggedInUser?.username;
    const role = loggedInUser?.role;



  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/files');
      setFiles(res.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser'); // Remove user data from localStorage
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <div className="admin-dashboard">
      <button className="logout-button" onClick={handleLogout}>Logout</button>

      <h2>Admin Dashboard</h2>
      <p>Welcome, {user} {role}</p> {/* Displaying username and role */}

      <UploadSection fetchFiles={fetchFiles} user={{ name: user, role: role }} /> {/* Passing user data to UploadSection */}
      <FileList files={files} fetchFiles={fetchFiles} />
      <AuditLogViewer />
      <AlertsViewer />
    </div>
  );
};

export default AdminDashboard;
