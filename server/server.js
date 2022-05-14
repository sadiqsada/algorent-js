const express = require('express');
const cors = require('cors');
// Accessing the path module
const path = require("path");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 8000;
const web_url = 'http://localhost:8000'//https://algorent-proj.herokuapp.com'
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

app.use(cors({ origin: web_url, credentials: true })); 
const router = require('./routes/router');
app.use('/', router);

app.use(express.static("public"));
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "public", "index.html"));
});

//console.log("TEST URL IS: " + process.env.TEST_URL)
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


