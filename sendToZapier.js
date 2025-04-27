// sendToZapier.js
const axios = require('axios');

// Function to send email to Zapier
async function sendEmailToZapier(data) {
  console.log('Sending data to Zapier...', data);
  try {
    let zap_url= 'https://hooks.zapier.com/hooks/catch/14130019/2p6fbin/'
    const response = await axios.post(zap_url, data);
    console.log('✅ Successfully sent to Zapier:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending to Zapier:', error.message);
    return { status: false, message: 'Failed to send to Zapier', error: error.message };
  }
}

module.exports = { sendEmailToZapier };
