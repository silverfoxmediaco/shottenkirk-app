// server/utils/seedInventory.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import Vehicle from '../models/Vehicle.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const seedInventory = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const results = [];

    // Read and parse CSV file
    fs.createReadStream('./server/data/inventory.csv')
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          vehicle: data['Vehicle'],
          stockNumber: data['Stock #'],
          vin: data['VIN'],
          class: data['Class'],
          msrp: data['MSRP'],
          adPrice: data['Ad. Price'],
          invoice: data['Invoice'],
          customerIncentives: data['Total Customer\nIncentives'] || data['Total Customer Incentives']
        });
      })
      .on('end', async () => {
        try {
          // Clear existing data
          await Vehicle.deleteMany({});
          console.log('Cleared existing inventory');

          // Insert new data
          const inserted = await Vehicle.insertMany(results);
          console.log(`Successfully seeded ${inserted.length} vehicles`);
          
          // Disconnect and exit
          await mongoose.disconnect();
          console.log('Disconnected from MongoDB');
          process.exit(0);
        } catch (err) {
          console.error('Error seeding inventory:', err);
          await mongoose.disconnect();
          process.exit(1);
        }
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        process.exit(1);
      });
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
};

// Run the seed function
seedInventory();