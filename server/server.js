const express = require('express');
const cors = require('cors');
// Accessing the path module
const path = require("path");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 8000;
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());
const web_url = 'https://algorent-proj.herokuapp.com' // 'http://localhost:3000'; // THIS NEEDS TO BE WEB URL
app.use(cors({ origin: web_url, credentials: true })); 
const router = require('./routes/router');
app.use('/', router);

/**ONLY HAVE THIS FOR HEROKU DEPLOYMENT! */
app.use(express.static("public"));
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "public", "index.html"));
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });


