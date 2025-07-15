const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const { sequelize } = require('./models');
const router = require('./routes');

(async () => {
  await sequelize.sync();

  // Use main router
  app.use('/', router);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})(); 