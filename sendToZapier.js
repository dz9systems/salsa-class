// sendToZapier.js
const axios = require('axios');
dotenv = require('dotenv');
dotenv.config();

// Function to send email to Zapier
async function newSalsaClassUpdate(date,time,data) {
  console.log('Sending data to Zapier...', data);
  try {
    const ZAP_SIGNUP_URL = 'https://hooks.zapier.com/hooks/catch/14130019/uh2d7sp/';
    const response = await axios.post(ZAP_SIGNUP_URL, {...data, time,date});
    console.log('✅ Successfully sent to Zapier:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending to Zapier:', error.message);
    return { status: false, message: 'Failed to send to Zapier', error: error.message };
  }
}

// Function to send email to Zapier
async function sendEmailToZapier(data) {
  console.log('Sending data to Zapier...', data);
  try {
    const ZAP_SIGNUP_URL = process.env.ZAP_SIGNUP_URL;
    const response = await axios.post(ZAP_SIGNUP_URL, data);
    console.log('✅ Successfully sent to Zapier:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending to Zapier:', error.message);
    return { status: false, message: 'Failed to send to Zapier', error: error.message };
  }
}

async function sendRandomEmail(data) {
  console.log('Sending data to Zapier...', data);
  try {
    const ZAP_RANDOM_EMAIL_URL = process.env.ZAP_RANDOM_EMAIL_URL;
    const response = await axios.post(ZAP_RANDOM_EMAIL_URL, data);
    console.log('✅ Successfully sent to Randomized Zapier:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending to Zapier:', error.message);
    return { status: false, message: 'Failed to send to Zapier', error: error.message };
  }
}

module.exports = { sendEmailToZapier, sendRandomEmail,newSalsaClassUpdate };
