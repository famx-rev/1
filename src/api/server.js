import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './auth.js';
// import userRoutes from './auth/user.js';
import apiRoutes from './api.js';
import agentRoutes from './routes/agents.js';
import logsRoutes from './routes/logs.js';
import healthRoutes from './routes/health.js';
import aiRouter from './routes/ai/index.js';
import resetMailRoutes from './routes/mail/reset.js';
import usageRoutes from './routes/usage/usage.js';
import waitlistRoutes from './routes/waitlist/waitlist.js';
import waitlistUserRoutes from './routes/waitlist/users.js';
import authxAppsRoutes from './routes/authx/apps.js';
import authxAuthRoutes from './routes/authx/auth.js';
import authxOAuthRoutes from './routes/authx/oauth.js';
import authxConfigureRoutes from './routes/authx/configure.js';
import authxUserRoutes from './routes/authx/user.js';
import marketplaceRoutes from './routes/universex/marketplace/index.js';

import datahubRoutes from './routes/datahub/datahub.js';

// Import news routes if needed
// import newsRoutes from './routes/news/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Enable trust proxy
app.enable('trust proxy');


// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/auth', authRoutes);
// app.use('/auth', userRoutes);
app.use('/api', apiRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/log', logsRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/ai', aiRouter);
app.use('/api/mail/reset', resetMailRoutes);
app.use('/api', usageRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/waitlist', waitlistUserRoutes);

// AuthX Routes
app.use('/api/authx/apps', authxAppsRoutes);
app.use('/api/authx/auth', authxAuthRoutes);
app.use('/api/authx/oauth', authxOAuthRoutes);
app.use('/api/authx/configure', authxConfigureRoutes);
app.use('/api/authx/:appId/user', authxUserRoutes); // This route handles all user-related endpoints including /all-users


// UniverseX Routes
app.use('/api/universex/marketplace', marketplaceRoutes);

// DataHub Routes
app.use('/api/d', datahubRoutes);

// News routes (if needed)
// app.use('/api/f', newsRoutes);

// Add a test route to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working', 
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Ensure JSON response for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
  }
  
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;