import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './alert.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // Track loading state

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setMessage('Failed to fetch alerts');
    } finally {
      setLoading(false); // Set loading to false when fetch completes
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="alerts-container">
      <h3>Alerts</h3>
      {loading && <p>Loading alerts...</p>} {/* Loading State */}
      {message && !loading && <p className="error-message">{message}</p>} {/* Error message */}
      {!loading && alerts.length === 0 && <p>No alerts available</p>} {/* No alerts available message */}
      
      {!loading && alerts.length > 0 && (
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Alert Type</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={index}>
                <td>{alert.timestamp}</td>
                <td>{alert.type}</td>
                <td>{alert.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Alerts;
