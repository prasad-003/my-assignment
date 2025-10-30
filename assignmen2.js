const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// ✅ Direct MongoDB connection (replace with your credentials)
const MONGO_URL = 'mongodb+srv://prasad:prasad@cluster0.jopr9fz.mongodb.net/';

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.log('❌ DB Connection Error:', err));

// ✅ Schema
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  event: { type: String, required: true },
  ticketType: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Model
const Booking = mongoose.model('Booking', bookingSchema);

// ✅ Default Route
app.get('/', (req, res) => {
  res.send('🎟 Synergia Event Booking API Connected to MongoDB');
});

// ✅ 1. GET - All bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 2. POST - Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, email, event, ticketType } = req.body;
    if (!name || !email || !event) {
      return res.status(400).json({ message: "Name, Email, and Event are required" });
    }

    const newBooking = new Booking({ name, email, event, ticketType });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 3. GET by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 4. PUT - Update booking
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });
    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 5. DELETE - Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 6. SEARCH - By email
app.get('/api/bookings/search', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email query required" });
    const booking = await Booking.findOne({ email });
    if (!booking) return res.status(404).json({ message: "No booking found for this email" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 7. FILTER - By event
app.get('/api/bookings/filter', async (req, res) => {
  try {
    const { event } = req.query;
    if (!event) return res.status(400).json({ message: "Event query required" });
    const filtered = await Booking.find({ event });
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => console.log('🚀 Server running on port ${PORT}'));
