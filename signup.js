const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { sendEmailToZapier } = require('./sendToZapier');
dotenv = require('dotenv');
dotenv.config();


// Load signups
const signupsPath = path.join(__dirname, 'signups.json');

function getSignups() {
  if (!fs.existsSync(signupsPath)) {
    return [];
  }
  const data = fs.readFileSync(signupsPath, 'utf-8');
  return JSON.parse(data);
}

async function saveSignup(signup) {
  try {
    // Check if the email is provided
    if (!signup.email) {
      return { status: false, message: 'Email is required', data: null };
    }

    // Check if the email already exists in the list
    const signups = getSignups();
    const existingSignup = signups.find(existing => existing.email === signup.email);
    if (existingSignup) {
      return { status: false, message: 'This email has already been used for signup', data: null };
    }

    // Add the signup to the list and save it
    signup.createdAt = new Date().toISOString(); // Adding a timestamp for the new signup
    signups.push(signup);

    // Save the updated signups list to the file
    fs.writeFileSync(signupsPath, JSON.stringify(signups, null, 2));

    // Send the email to Zapier after saving
    const ZAP_SIGNUP_URL = process.evn.ZAP_SIGNUP_URL;
    const {data:zapResponse} = await axios.post(ZAP_SIGNUP_URL, signup);
    console.log('zapResponse::', zapResponse);

    return { status: true, message: 'Signup successful', data: signup };
  } catch (error) {
    console.error('Error in saveSignup:', error);
    return { status: false, message: 'An error occurred during signup', data: null };
  }
}



module.exports = { getSignups, saveSignup };
