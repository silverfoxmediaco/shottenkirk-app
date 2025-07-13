// server/routes/conciergeSessionRoutes.js

import express from 'express';
import ConciergeSession from '../models/ConciergeSession.js';
import { sendCompletionEmail } from '../utils/sendEmail.js'; // ✅ NEW

const router = express.Router();

// GET /api/concierge/session/:id
router.get('/session/:id', async (req, res) => {
  const sessionId = req.params.id;

  try {
    const session = await ConciergeSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const uploaded = session.uploadedDocs;
    const missing = Object.entries(uploaded)
      .filter(([_, val]) => !val)
      .map(([doc]) => doc);

    res.json({
      sessionId: session.sessionId,
      vehicle: session.vehicle,
      purchaseType: session.purchaseType,
      uploadedDocs: uploaded,
      missingDocs: missing,
      complete: missing.length === 0
    });
  } catch (err) {
    console.error('Fetch session failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/concierge/session
router.post('/session', async (req, res) => {
  const { sessionId, vehicle, purchaseType } = req.body;

  try {
    let session = await ConciergeSession.findOne({ sessionId });

    if (!session) {
      session = await ConciergeSession.create({
        sessionId,
        vehicle,
        purchaseType,
      });
    }

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create or fetch session' });
  }
});

// PUT /api/concierge/session/upload
router.put('/session/upload', async (req, res) => {
  const { sessionId, docType, fileUrl } = req.body;

  if (!['driverLicense', 'insuranceCard', 'tradeInTitle'].includes(docType)) {
    return res.status(400).json({ error: 'Invalid document type' });
  }

  try {
    const session = await ConciergeSession.findOneAndUpdate(
      { sessionId },
      { $set: { [`uploadedDocs.${docType}`]: fileUrl } },
      { new: true }
    );

    // ✅ Check if all documents have been uploaded
    const docs = session.uploadedDocs;
    const allUploaded = docs.driverLicense && docs.insuranceCard && docs.tradeInTitle;

    if (allUploaded) {
      await sendCompletionEmail(session);
    }

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

export default router;
