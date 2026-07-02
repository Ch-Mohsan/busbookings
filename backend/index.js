const express = require('express');
const mongoose = require('mongoose');
let 
cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

 cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
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

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error('MongoDB connection error:', err));
// ✅ Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Server is running on port ${process.env.PORT || 5000}`);
});

// ✅ Export app (for Vercel)
module.exports = app;


