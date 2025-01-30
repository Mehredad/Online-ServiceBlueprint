const express = require('express');
const cors = require('cors'); // Import cors
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config(); // Load environment variables

const app = express();

// Enable CORS
app.use(cors());  // Allow all origins (you can specify more specific options)

// Connect to MongoDB
connectDB();

// Middleware to parse JSON data
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
