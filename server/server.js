const express = require('express');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const app = express();
const PORT = 8000;
dotenv.config()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!');
})

const top5listsRouter = require('./routes/router')
app.use('/', top5listsRouter)

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`)
    })
  })
  .catch((err) => {
    console.log(err.message)
  })