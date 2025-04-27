// server.js
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const bodyParser = require('body-parser');
const cors = require('cors');
const { saveSignup, getSignups } = require('./signup');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors
app.use(cors({
  origin: '*', // Allow all origins
}));

// Tell Express to serve files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup', (req, res) => {
  const { name, email, role } = req.body;
  console.log('Received signup data:', req.body);
  // const newSignup = { name, email, role };
  const isSignedUp = saveSignup(req.body);
  console.log('isSignedUp', isSignedUp);
  if (isSignedUp.status) {
     return res.json({ status:isSignedUp.status,message: 'Signup successful', data: newSignup });
  } else {
    return res.json(isSignedUp);
  }

});

// GET route to fetch the list of signups
app.get('/signups', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'signups.json'), 'utf-8');
    const signups = JSON.parse(data);

    // Sort by createdAt field, latest first
    signups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(signups);
  } catch (err) {
    res.status(500).json({ message: 'Failed to read signups data' });
  }
});

// DLETE PERSON FROM SIGNUPS
app.delete('/signups/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const data = await fs.readFile(path.join(__dirname, 'signups.json'), 'utf-8');
    const signups = JSON.parse(data);
    const filteredSignups = signups.filter((signup) => signup.email !== email);
    await fs.writeFile(path.join(__dirname, 'signups.json'), JSON.stringify(filteredSignups, null, 2));
    res.json({ message: 'Signup deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete signup' });
  }
}
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
