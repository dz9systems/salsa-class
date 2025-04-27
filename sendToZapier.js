// sendToZapier.js
const axios = require('axios');

// Function to send email to Zapier
async function sendEmailToZapier(data) {
  console.log('Sending data to Zapier...', data);
  try {
    const response = await axios.post('https://hooks.zapier.com/hooks/catch/14130019/2p6fbin/', data);
    console.log('✅ Successfully sent to Zapier:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending to Zapier:', error.message);
    return { status: false, message: 'Failed to send to Zapier', error: error.message };
  }
}

module.exports = { sendEmailToZapier };
