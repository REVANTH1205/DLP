import React, { useState, useEffect } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser'; // Import EmailJS
import './audit.css';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [emailInputVisible, setEmailInputVisible] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/audit-logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setMessage('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    emailjs.init('9m9le6rGrBSEGy5gv'); // Replace with your EmailJS Public Key
  }, []);

  const formatLogs = () => {
    return logs.map(log =>
      `Timestamp: ${log.timestamp}, Action: ${log.action}, User: ${log.user}, Role: ${log.role}, Details: ${log.details}`
    ).join('\n');
  };

  const sendLogsToEmail = () => {
    if (!recipientEmail) {
      alert('Please enter an email address.');
      return;
    }

    const templateParams = {
      to_email: recipientEmail,
      log_message: formatLogs(),
    };

    emailjs.send('service_tw9464k', 'template_8e672nq', templateParams)
      .then(() => {
        alert('Logs sent successfully!');
        setRecipientEmail('');
        setEmailInputVisible(false);
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        alert('Failed to send logs.');
      });
  };

  return (
    <div className="audit-logs-container">
      <h3>Audit Logs</h3>

      {loading && <p>Loading logs...</p>}
      {message && !loading && <p className="error-message">{message}</p>}
      {!loading && logs.length === 0 && <p>No logs available</p>}

      {!loading && logs.length > 0 && (
        <>
          <table className="logs-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>User</th>
                <th>Role</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{log.timestamp}</td>
                  <td>{log.action}</td>
                  <td>{log.user}</td>
                  <td>{log.role}</td>
                  <td>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => setEmailInputVisible(true)}>Send Logs to Email</button>

          {emailInputVisible && (
            <div className="email-input">
              <input
                type="email"
                placeholder="Enter recipient email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
              <button onClick={sendLogsToEmail}>Send</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuditLogs;
