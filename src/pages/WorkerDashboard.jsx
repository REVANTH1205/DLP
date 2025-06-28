import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './work.css';


const WorkerDashboard = () => {
  const [files, setFiles] = useState([]);


  // const user = localStorage.getItem('username'); // Fetch dynamically
  // const role = localStorage.getItem('role'); // Fetch dynamically

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/files');
      const filteredFiles = response.data.filter(file => file.sensitivity === 'low');
      setFiles(filteredFiles);
    } catch (_) {
      alert('Failed to fetch files',_);
    }
  };

// Handle Download
const handleDownload = async (filename) => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const user = loggedInUser?.username;
  const role = loggedInUser?.role;

  console.log('User:', user);
  console.log('Role:', role);
  try {
    await axios.get(`http://localhost:5000/files/${filename}`, {
      headers: {
        user,
        role
      },
      responseType: 'blob'
    }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    });
  } catch (err) {
    alert('Download failed.', err);
  }
};

// Handle Delete for Admin (Authorized only for Admin, Officer/Worker are Unauthorized)
const handleDelete = async (filename) => {
  
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const user = loggedInUser?.username;
  const role = loggedInUser?.role;

  console.log('User:', user);
  console.log('Role:', role);

  try {
    await axios.delete(`http://localhost:5000/files/${filename}`, {
      headers: {
        user,
        role
      }
    });
    alert('File deleted successfully');
    fetchFiles();
  } catch (error) {
    console.error('Error deleting file:', error);
    alert('Unauthorized to delete this file');
  }
};
const handleLogout = () => {
  localStorage.removeItem('loggedInUser'); // Remove user data from localStorage
  window.location.href = '/login'; // Redirect to login page (adjust based on your app routing)
};

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div  className="worker-dashboard" >
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h3>Worker Dashboard</h3>
      <table>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Sensitivity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.filename}>
              <td>{file.filename}</td>
              <td>{file.sensitivity}</td>
              <td>
                <button onClick={() => handleDownload(file.filename)}>Download</button>
                <button onClick={() => handleDelete(file.filename)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkerDashboard;
