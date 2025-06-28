import React, { useState, useEffect } from 'react';

import './list.css';
import axios from 'axios';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch the file list from the server
  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      setMessage('Failed to fetch files');
    }
  };

  // Handle the deletion of a file
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

  // Handle the download of a file
  const handleDownload = (filename) => {
    window.open(`http://localhost:5000/files/${filename}`, '_blank');
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="file-list">
      <h3>File List</h3>
      {message && <p>{message}</p>}
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
              <td>{file.sensitivity}</td> {/* Display file sensitivity */}
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

export default FileList;
