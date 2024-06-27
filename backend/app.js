const express = require('express');
const setupSwagger = require('./swagger');
require("dotenv").config();

const helmet = require('helmet');
const corsMiddleware = require('./middleware/cors');
const loggerMiddleware = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const rateLimitMiddleware = require('./middleware/rateLimit');
const ajaxRouter = require('./routes/ajax/ajax.routes');
const dashboardRouter = require('./routes/dashboard/dashboard.routes');
const authRouter = require('./routes/auth/auth.routes');

// create express app
const app = express();
const port = Number(process.env.PORT);

// Use CORS middleware
//app.use(corsMiddleware);
app.use(cors);
// Use logger middleware
app.use(loggerMiddleware);
app.use(rateLimitMiddleware);
// enable parsing of request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

// Set up Swagger
setupSwagger(app);





app.use('/api/ajax', ajaxRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/auth', authRouter);

// catch 404 and forward to error handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
