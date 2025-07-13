// client/src/components/finance/FinanceConcierge.jsx

import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './FinanceConcierge.css';
import DocumentStatus from './DocumentStatus';

const FinanceConcierge = ({ context }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    let storedSession = localStorage.getItem('gcSessionId');
    if (!storedSession) {
      storedSession = uuidv4();
      localStorage.setItem('gcSessionId', storedSession);
    }
    setSessionId(storedSession);

    const createSession = async () => {
      try {
        await fetch('/api/concierge/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: storedSession,
            vehicle: context?.vehicle,
            purchaseType: context?.purchaseType
          })
        });
      } catch (err) {
        console.error('Failed to create concierge session', err);
      }
    };

    if (context?.vehicle && context?.purchaseType) {
      createSession();
    }
  }, [context]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('/api/agent/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input, context, sessionId })
      });

      const data = await res.json();
      const botMessage = { role: 'agent', text: data.reply };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Agent error:', err);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach(file => formData.append('documents', file));

    try {
      const res = await fetch('/api/uploads/verify-docs', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      const docTypes = ['driverLicense', 'insuranceCard', 'tradeInTitle'];
      const newDocs = {};

      for (let i = 0; i < data.uploaded.length && i < docTypes.length; i++) {
        const docType = docTypes[i];
        const file = data.uploaded[i];
        newDocs[docType] = file;

        await fetch('/api/concierge/session/upload', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            docType,
            fileUrl: `/uploads/${file}`
          })
        });
      }

      setUploadedDocs(prev => ({ ...prev, ...newDocs }));
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="finance-concierge">
      <h2>Talk to Your Finance Concierge</h2>

      <div className="chat-window">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="question-form">
        <input
          type="text"
          placeholder="Ask anything about leasing, financing, or buying..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      <div className="upload-section">
        <h4>Upload Required Documents</h4>
        <p>Driver’s License, Proof of Insurance, Trade-in Title, etc.</p>
        <input type="file" multiple onChange={handleFileUpload} />

        {Object.keys(uploadedDocs).length > 0 && (
          <ul className="uploaded-list">
            {Object.entries(uploadedDocs).map(([docType, fileName]) => (
              <li key={docType}>
                <strong>{docType}:</strong>{' '}
                <a href={`/uploads/${fileName}`} target="_blank" rel="noopener noreferrer">
                  {fileName}
                </a>
              </li>
            ))}
          </ul>
        )}

        {sessionId && <DocumentStatus sessionId={sessionId} />}
      </div>
    </div>
  );
};

export default FinanceConcierge;
