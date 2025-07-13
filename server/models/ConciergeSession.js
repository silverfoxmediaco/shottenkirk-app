// server/models/ConciergeSession.js

import mongoose from 'mongoose';

const conciergeSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true }, // Could also be userId if authenticated
  vehicle: {
    year: Number,
    make: String,
    model: String,
    price: Number,
  },
  purchaseType: { type: String, enum: ['buy', 'lease', 'finance'] },
  uploadedDocs: {
    driverLicense: { type: String, default: null },
    insuranceCard: { type: String, default: null },
    tradeInTitle: { type: String, default: null },
  },
  createdAt: { type: Date, default: Date.now },
});

const ConciergeSession = mongoose.model('ConciergeSession', conciergeSessionSchema);
export default ConciergeSession;
