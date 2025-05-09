import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbUri=process.env.MONGO_URI


mongoose.connect(dbUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

 
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
    if (err.code === 11000) {
      return res.json({ message: 'Email already exists.' });
    }

    console.error('Error saving email:', err);
    res.json({ message: 'Server error. Please try again later.' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
