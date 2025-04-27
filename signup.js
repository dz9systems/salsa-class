const fs = require('fs');
const path = require('path');
const { sendEmailToZapier } = require('./sendToZapier');

// Load signups
const signupsPath = path.join(__dirname, 'signups.json');

function getSignups() {
  if (!fs.existsSync(signupsPath)) {
    return [];
  }
  const data = fs.readFileSync(signupsPath, 'utf-8');
  return JSON.parse(data);
}

function saveSignup(signup) {
  // Check if the email is provided
  if (!signup.email) {
    return {status: false,  message:'Email is required',data:null};

  }

  // Check if the email already exists in the list
  const signups = getSignups();
  const existingSignup = signups.find(existing => existing.email === signup.email);
  if (existingSignup) {
    return {status: false, message:'This email has already been used for signup',data:null};
  }

  // Add the signup to the list and save it
  signup.createdAt = new Date().toISOString(); // Adding a timestamp for the new signup
  signups.push(signup);
  console.log('signups', signups);
  fs.writeFileSync(signupsPath, JSON.stringify(signups, null, 2));
  console.log('signups after write to file', signups);
  // Send the email to Zapier after saving
  sendEmailToZapier(signup);
  return {status: true, message:'Signup successful', data: signup};
}

module.exports = { getSignups, saveSignup };
