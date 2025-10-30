const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // to parse JSON body

const connectDb = 'mongodb+srv://prasad:prasad@cluster0.jopr9fz.mongodb.net/';

mongoose.connect(connectDb)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Default route
app.get('/', (req, res) => {
  res.send('Get route');
});

// Schema & Model
const studentSchema = new mongoose.Schema({
  stuname: String,
  USN: String,
  email: String,
  isRegistered: Boolean,
  contact: Number,
  Age: Number
});

const StudentModel = mongoose.model('Student', studentSchema);

// ✅ Create student data (POST)
app.post('/Student', async (req, res) => {
  try {
    const data = req.body;
    const { stuname, USN, email, isRegistered, contact, Age } = data;

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email or USN already exists
    const existingStudent = await StudentModel.findOne({
      $or: [{ email: email }, { USN: USN }]
    });
    if (existingStudent) {
      return res.status(400).json({ error: "Email or USN already exists" });
    }

    // Create new student
    const mydata = await StudentModel.create({
      stuname,
      USN,
      email,
      isRegistered,
      contact,
      Age
    });

    return res.status(201).json({
      message: "Student data created successfully",
      data: mydata
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Delete student data by USN (DELETE)
app.delete('/Student/:USN', async (req, res) => {
  try {
    const usn = req.params.USN;
    const deletedStudent = await StudentModel.findOneAndDelete({ USN: usn });

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({
      message: "Student deleted successfully",
      data: deletedStudent
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});