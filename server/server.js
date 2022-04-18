const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const app = express();
const PORT = 8000;
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit:'20mb'}));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const router = require('./routes/router');

app.use('/', router);

mongoose
  .connect(process.env.MONGODB_URI, {
    // 'mongodb://127.0.0.1:27017/algorent'
    useNewUrlParser: true,
    autoIndex: false,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
