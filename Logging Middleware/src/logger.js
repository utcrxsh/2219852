const axios = require('axios');
require('dotenv').config();

const LOG_ENDPOINT = 'http://20.244.56.144/evaluation-service/logs';
const AUTH_TOKEN = process.env.LOG_AUTH_TOKEN;
console.log('LOG_AUTH_TOKEN:', AUTH_TOKEN);

async function logEvent(stack, level, pkg, message) {
  try {
    const payload = {
      stack,
      level,
      package: pkg,
      message,
    };
    await axios.post(
      LOG_ENDPOINT,
      payload,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    
    console.error('Logging failed:', err.message);
  }
}

module.exports = { logEvent }; 