const fs = require('fs');
const path = require('path');
const axios = require('axios');

// SAVE TO WATING LIST waitingList.json
async function saveWaitingList(wl_signup) {
  try {
    // Check if the email is provided
    if (!wl_signup.email) {
      return { status: false, message: 'Email is required', data: null };
    }

    // Load existing waiting list
    const waitingListPath = path.join(__dirname, 'waitingList.json');
    let waitingList = [];
    if (fs.existsSync(waitingListPath)) {
      const data = fs.readFileSync(waitingListPath, 'utf-8');
      waitingList = JSON.parse(data);
    }

    // Check if the email already exists in the waiting list
    const existingSignup = waitingList.find(existing => existing.email === wl_signup.email);
    if (existingSignup) {
      return { status: false, message: 'This email has already been used for signup', data: null };
    }

    // Add the signup to the waiting list and save it
    wl_signup.createdAt = new Date().toISOString(); // Adding a timestamp for the new signup
    waitingList.push(wl_signup);

    // Save the updated waiting list to the file
    fs.writeFileSync(waitingListPath, JSON.stringify(waitingList, null, 2));

    // Send the email to Zapier after saving
    const zap_url = 'https://hooks.zapier.com/hooks/catch/14130019/2psq6o0/';
    const { data: zapResponse } = await axios.post(zap_url, wl_signup);
    console.log('zapResponse::', zapResponse);

    return { status: true, message: 'Waiting list signup successful', data: wl_signup };
  } catch (error) {
    console.error('Error in saveWaitingList:', error);
    return { status: false, message: 'An error occurred during waiting list signup', data: null };
  }
}

module.exports = { saveWaitingList };