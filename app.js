require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');


const express = require('express');
const app = express();

// connect DB
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

// routers
const authRouter = require('./routes/auth');
const jobRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// limit requests
app.set('trust proxy', 1);
app.use(rateLimit({
  windowMs: 15 * 6 * 1000, // 15min
  max: 100 // limit each IP to 100 requests per windowMs
}));
// express set up
app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xxs());


// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();