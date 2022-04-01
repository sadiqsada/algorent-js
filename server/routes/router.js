const express = require('express');
const UserController = require('../controllers/user');
const ExploreController = require('../controllers/explore');
const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgotpassword', UserController.forgotPassword);
router.get('/verify/:confirmationCode', UserController.verify);
router.post('/password-rest/:resetCode', UserController.resetPassword);
router.get('/logout', UserController.logout);
router.post('/tokenIsValid', UserController.tokenIsValid);
router.post('/explore', ExploreController.explore);

module.exports = router;
