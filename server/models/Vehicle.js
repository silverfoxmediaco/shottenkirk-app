// server/models/Vehicle.js
import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicle: String,
  stockNumber: String,
  vin: String,
  class: String,
  msrp: String,
  adPrice: String,
  invoice: String,
  customerIncentives: String
});

export default mongoose.model('Vehicle', vehicleSchema);
