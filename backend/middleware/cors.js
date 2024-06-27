const cors = require('cors');
require("dotenv").config();

const allowedOrigins = process.env.ORIGINS ? process.env.ORIGINS.split(',') : [];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,POST',
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = cors();
