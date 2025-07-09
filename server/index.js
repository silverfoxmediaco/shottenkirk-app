// server/index.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import testDriveRoutes from './routes/testDriveRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5050;

// Simple CORS setup for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, the frontend is served from the same domain
    // so we can allow the Render domain
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174', 
      'http://localhost:5175',
      'http://localhost:5176',
      'https://shottenkirk-app.onrender.com',
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log the origin that's being blocked for debugging
      console.log('Blocked by CORS:', origin);
      callback(null, false); // Don't throw error, just deny
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// API Routes
app.use('/api/test-drive', testDriveRoutes);
app.use('/api/inventory', inventoryRoutes);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = join(__dirname, '..', 'client', 'dist');
  
  app.use(express.static(clientDistPath));
  
  // Fallback for React Router
  app.get('*', (req, res) => {
    res.sendFile(join(clientDistPath, 'index.html'));
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });