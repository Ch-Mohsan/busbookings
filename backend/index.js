const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true // if you use cookies/auth
}));

app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const stationRoutes = require('./routes/stationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// API routes
app.use('/api/users', userRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/bookings', bookingRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Bus Booking API");
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error('MongoDB connection error:', err));

// ✅ Export app (for Vercel)
module.exports = app;

if (require.main === module && process.env.VERCEL !== '1') {
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
  });
}


