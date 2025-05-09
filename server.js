import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// MongoDB connection
const dbUri = process.env.MONGO_URI;

mongoose.connect(dbUri)
.then(() => {
  console.log('✅ Connected to MongoDB');
  // Start server only after DB connection
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Email schema + model
const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
});

const Email = mongoose.model('Email', emailSchema);

// API route
app.post('/notify', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.json({ message: 'Please enter a valid email.' });
  }

  try {
    const newEmail = new Email({ email });
    await newEmail.save();
    res.json({ message: 'You’ll be notified when we launch!' });
  } catch (err) {
    console.error('❌ Error saving email:', err);
    res.json({ message: 'Error saving email.' });
  }
});
