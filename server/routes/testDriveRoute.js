// server/routes/testDriveRoute.js
import express from 'express';
import { submitTestDrive } from '../controllers/testDriveController.js';

const router = express.Router();

router.post('/', submitTestDrive);

export default router;
