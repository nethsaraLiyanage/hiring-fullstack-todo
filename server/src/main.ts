import 'dotenv/config';
import express from 'express';
import * as path from 'path';
import mongoose from 'mongoose';
import tasksRouter from './routes/tasks';

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  return next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// MongoDB connection middleware - check connection before processing API requests
app.use('/api/todos', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database not connected',
      details: 'Please wait for the database connection to be established',
    });
  }
  return next();
});

// API routes
app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to server!' });
});

app.use('/api/todos', tasksRouter);

// Redirect non-API routes to frontend
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.get('*', (req, res, next) => {
  // Don't redirect API routes or assets
  if (req.path.startsWith('/api') || req.path.startsWith('/assets')) {
    return next();
  }
  // Redirect to frontend, preserving the path
  res.redirect(302, frontendUrl + req.path);
});

// MongoDB connection
const mongoURI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

// Start server only after MongoDB connection
const port = process.env.PORT || 3338;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    // Start server after MongoDB is connected
    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', console.error);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if DB connection fails
  });
