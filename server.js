import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/notify', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.json({ message: 'Please enter a valid email.' });
  }

  fs.appendFile('emails.txt', email + '\n', err => {
    if (err) return res.json({ message: 'Error saving email.' });
    res.json({ message: 'You’ll be notified when we launch!' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
