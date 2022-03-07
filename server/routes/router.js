const auth = require('../auth/auth')
const express = require('express')
const UserController = require('../controllers/user')
const router = express.Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/forgotpassword', UserController.forgotPassword)
router.get('/verify/:confirmationCode', UserController.verify)
router.post('/password-rest/:resetCode', UserController.resetPassword)
router.get('/logout', UserController.logout)
module.exports = router