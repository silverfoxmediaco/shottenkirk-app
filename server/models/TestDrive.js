// server/models/TestDrive.js
import mongoose from 'mongoose';

const testDriveSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: String,
  phone: String,
  vehicleId: String,
  vehicleModel: String,
  preferredDate: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('TestDrive', testDriveSchema);
