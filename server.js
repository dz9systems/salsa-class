// server.js
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const bodyParser = require('body-parser');
const cors = require('cors');
const { saveSignup, getSignups } = require('./signup');
const { sendEmailToZapier, sendRandomEmail } = require('./sendToZapier');
const { saveWaitingList } = require('./waitingList');
const templates  = require('./emailTemplates.js');

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


// SEND SIGNUP DATA TO SIGNUPS.JSON AND ZAPIER
app.post('/signup', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    console.log('Received signup data:', req.body);

    const newSignup = { name, email, role }; // restoring your newSignup object
    const isSignedUp = await saveSignup(newSignup); // add await here since saveSignup is async
    console.log('isSignedUp', isSignedUp);

    if (newSignup.email) {
      return res.json({ status: true, message: 'Signup successful', data: newSignup });
    } else {
      return res.json({ status: false, message: 'Signup NOT Successful', data: newSignup });
    }
  } catch (error) {
    console.error('Error in /signup route:', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error', data: null });
  }
});

// SEND WAITING LIST DATA TO WAITINGLIST.JSON AND ZAPIER
app.post('/waitingList', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    console.log('Received waiting list data:', req.body);

    const newWaitingListSignup = { name, email, role };
    const isSignedUp = await saveWaitingList(newWaitingListSignup); // add await here since saveSignup is async
    console.log('isSignedUp', isSignedUp);

    if (newWaitingListSignup.email) {
      return res.json({ status: true, message: 'Waiting list signup successful', data: newWaitingListSignup });
    } else {
      return res.json({ status: false, message: 'Waiting list signup NOT Successful', data: newWaitingListSignup });
    }
  } catch (error) {
    console.error('Error in /waitingList route:', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error', data: null });
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

// GET WAITING LIST
app.get('/waitingList', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'waitingList.json'), 'utf-8');
    const waitingList = JSON.parse(data);

    // Sort by createdAt field, latest first
    waitingList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(waitingList);
  } catch (err) {
    res.status(500).json({ message: 'Failed to read waiting list data' });
  }
});

// DELETE WAITLIST
app.delete('/waitingList/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const data = await fs.readFile(path.join(__dirname, 'waitingList.json'), 'utf-8');
    const waitingList = JSON.parse(data);
    const filteredWaitingList = waitingList.filter((signup) => signup.email !== email);
    await fs.writeFile(path.join(__dirname, 'waitingList.json'), JSON.stringify(filteredWaitingList, null, 2));
    res.json({ message: 'Waiting list signup deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete waiting list signup' });
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


// SEND GROUP EMAIL TO ZAPIER
app.post('/sendGroupEmail', async (req, res) => {
  try {
     const signups = req.body;
     console.log('Received signups for group email:', signups);
    // Send email to each signup
    for (const signup of signups) {
      console.log('Sending email to:', signup);
        // sendEmailToZapier(signup);
    }
    res.json({ message: 'Emails sent successfully', data:req.body  });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send emails'});
  }
});

// SEND RANDOM GROUP EMAIL
app.post('/sendRandomGroupEmail', async (req, res) => {
  try {
    const attendees = req.body;

    // Assign a random template to each attendee
    const payload = attendees.map(attendee => {
      const template = templates[Math.floor(Math.random() * templates.length)];
      return {
        ...attendee,
        ...template
      };
    });

    console.log('Generated email payload:', payload); // Log for testing

    // // Send each email via Zapier
    for (const person of payload) {
      await sendRandomEmail(person); // assumes this function handles Subject, L1, etc.
    }

    res.json({ message: 'Emails sent successfully', data: payload });
  } catch (err) {
    console.error('Error sending emails:', err);
    res.status(500).json({ message: 'Failed to send emails' });
  }

});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

