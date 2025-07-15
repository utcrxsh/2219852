// Helper to import the reusable logger
const path = require('path');
const { logEvent } = require(path.join(__dirname, '../../Logging Middleware/src/logger'));

module.exports = { logEvent }; 