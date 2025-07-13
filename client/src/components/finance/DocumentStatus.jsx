// File: client/src/components/finance/DocumentStatus.jsx

import React, { useEffect, useState } from 'react';
import './DocumentStatus.css';

const REQUIRED_DOCS = {
  driverLicense: 'Driver License',
  insuranceCard: 'Insurance Card',
  tradeInTitle: 'Trade-In Title',
};

const DocumentStatus = ({ sessionId }) => {
  const [loading, setLoading] = useState(true);
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [missingDocs, setMissingDocs] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/concierge/session/${sessionId}`);
        const data = await res.json();

        setUploadedDocs(data.uploadedDocs);
        setMissingDocs(data.missingDocs);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doc status', err);
      }
    };

    if (sessionId) {
      fetchStatus();
    }
  }, [sessionId]);

  if (loading) return <p>Checking document status...</p>;

  const isComplete = missingDocs.length === 0;

  return (
    <div className="doc-status-box">
      <h4>Document Status</h4>
      {isComplete ? (
        <p className="complete-msg">✅ All documents have been received!</p>
      ) : (
        <ul className="doc-list">
          {Object.keys(REQUIRED_DOCS).map((key) => (
            <li key={key} className={uploadedDocs[key] ? 'uploaded' : 'missing'}>
              {uploadedDocs[key] ? '✅' : '❌'} {REQUIRED_DOCS[key]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentStatus;
