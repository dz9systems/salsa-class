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
    const zap_url = 'https://hooks.zapier.com/hooks/catch/14130019/2p6fbin/';
    const response = await axios.post(zap_url, signup);
    const successEmail = await sendEmailToZapier(signup);

    console.log('signup after write to file::', signup);
    console.log('sendEmailToZapier(signup);::', successEmail);

    return { status: true, message: 'Signup successful', data: signup };
  } catch (error) {
    console.error('Error in saveSignup:', error);
    return { status: false, message: 'An error occurred during signup', data: null };
  }
}


module.exports = { getSignups, saveSignup };
