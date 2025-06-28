import React, { useState } from 'react';
import axios from 'axios';

const UploadSection = ({ fetchFiles, user }) => {
  const [file, setFile] = useState(null);
  const [sensitivity, setSensitivity] = useState('low');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSensitivityChange = (e) => {
    setSensitivity(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sensitivity', sensitivity);
    formData.append('user', user.name);  // Adding user name
    formData.append('role', user.role);  // Adding user role

    try {
      await axios.post('http://localhost:5000/upload', formData);
      setMessage('File uploaded successfully');
      setFile(null);
      setSensitivity('low');
      fetchFiles(); // Refresh list
    } catch (err) {
      console.error(err);
      setMessage('File upload failed');
    }
  };

  return (
    <div className="upload-section">
      <h3>Upload File</h3>
      {/* <p>User: {user.name} ({user.role})</p> Displaying user name and role in the upload section */}
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleChange} />
        <select value={sensitivity} onChange={handleSensitivityChange}>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadSection;
