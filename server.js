const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const playerRoutes = require('./routes/playerRoutes');
const ruleRoutes = require('./routes/ruleRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set global MongoDB connection flag
global.isMongoConnected = false;

// Connect to MongoDB (optional - for storing dynamic rules)
// Uncomment the following block to enable MongoDB connection
/*
mongoose.connect('mongodb://localhost:27017/football-compensation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  global.isMongoConnected = true;
}).catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Running with in-memory rule storage only');
});
*/

// In-memory rule storage as fallback when MongoDB is not connected
global.inMemoryRules = [];

// Routes
app.use('/api/player', playerRoutes);
app.use('/api/rule', ruleRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Football Player Compensation API',
    mongodbStatus: global.isMongoConnected ? 'connected' : 'not connected (using in-memory storage)'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`MongoDB is ${global.isMongoConnected ? 'connected' : 'not connected (using in-memory storage)'}`);
});

// For clean app shutdown
process.on('SIGINT', () => {
  if (global.isMongoConnected) {
    mongoose.connection.close();
  }
  console.log('App shutting down');
  process.exit(0);
});
