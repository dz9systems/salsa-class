const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { sendEmailToZapier } = require('./sendToZapier');
dotenv = require('dotenv');
dotenv.config();


// Load signups
const signupsPath = path.join(__dirname, 'signups.json');
const emailListPath = path.join(__dirname, 'email-list.json');

function getSignups() {
  if (!fs.existsSync(signupsPath)) {
    return [];
  }
  const data = fs.readFileSync(signupsPath, 'utf-8');
  return JSON.parse(data);
}

function getEmailList() {
  if (!fs.existsSync(emailListPath)) {
    return [];
  }
  const data = fs.readFileSync(emailListPath, 'utf-8');
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
    const emailList = getEmailList();
    const existingSignup = signups.find(existing => existing.email === signup.email);
    if (existingSignup) {
      return { status: false, message: 'This email has already been used for signup', data: null };
    }

    // Add createdAt property to object
    signup.createdAt = new Date().toISOString(); // Adding a timestamp for the new signup
    // Add new sign up to sign-up list array
    signups.push(signup);
    // Add new sign up to email list array
    emailList.push(signup);


    // Save the updated signups list to the file
    fs.writeFileSync(signupsPath, JSON.stringify(signups, null, 2));

    // if new signup is not in the email list add to email-list.json
    const existingEmailList = emailList.find(existing => existing.email === signup.email);
    console.log('existingEmailList', existingEmailList)
    if (existingEmailList) {
      return { status: false, message: 'This email has already exist in email-list.json', data: null };
    }
    else {
      // Save new sign-up to email-list.json
      fs.writeFileSync(emailListPath, JSON.stringify(emailList, null, 2));
    }

    // Send the email to Zapier after saving
    const ZAP_SIGNUP_URL = process.env.ZAP_SIGNUP_URL;
    console.log('ZAP_SIGNUP_URL...', ZAP_SIGNUP_URL);

    const { data: zapResponse } = await axios.post(ZAP_SIGNUP_URL, signup);
    console.log('zapResponse::', zapResponse);

    return { status: true, message: 'Signup successful', data: signup };
  } catch (error) {
    console.error('Error in saveSignup:', error);
    return { status: false, message: 'An error occurred during signup', data: null };
  }
}



module.exports = { getSignups, saveSignup };
