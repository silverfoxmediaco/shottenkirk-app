// server/routes/inventoryRoutes.js
import express from 'express';
import Vehicle from '../models/Vehicle.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
