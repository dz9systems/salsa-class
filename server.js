const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = 3000;

const signupsFile = path.join(__dirname, 'signups.json');

// Middleware to parse JSON
app.use(express.json());

// Tell Express to serve files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to get all signups
app.get('/signups', async (req, res) => {
  try {
    const data = await fs.readFile(signupsFile, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.json([]); // Empty array if no file yet
  }
});

// Route to post a new signup
app.post('/signup', async (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) {
    return res.status(400).send('Name and role are required');
  }

  let signups = [];
  try {
    const data = await fs.readFile(signupsFile, 'utf8');
    signups = JSON.parse(data);
  } catch (err) {
    // No signups yet, start fresh
  }

  signups.push({ name, role });

  await fs.writeFile(signupsFile, JSON.stringify(signups, null, 2));
  res.status(201).send('Signed up!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
