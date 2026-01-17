// Zomato Ops Pro – Smart Kitchen + Delivery Hub (MERN Backend)
const express = require('express');
const cors = require('cors');

require('dotenv').config();

// Import routes
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

// Import database connection
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api', authRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
});
