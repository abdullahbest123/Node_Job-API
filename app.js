require('dotenv').config();
require('express-async-errors');
const express = require('express');
const path = require('path');
const app = express();
const connectDB = require('./db/connect')
const jobsRouter = require('./routes/jobs')
const authRouter = require('./routes/auth')
const helmet = require('helmet');
const xss = require('xss-clean');
const expressratelimiter = require('express-rate-limit');
const cors = require('cors')
const authicateUser = require('./middleware/authentication');
// error handlers
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);

app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(express.json());
// extra packages
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(expressratelimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// routes
app.use('/api/v1/jobs', authicateUser, jobsRouter)
app.use('/api/v1/auth', authRouter)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () =>
{
  try
  {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error)
  {
    console.log(error);
  }
};

start();
