const express = require('express');
const UserController = require('../controllers/user');
const ExploreController = require('../controllers/explore');
const ListingController = require('../controllers/listing');
const auth = require('../middlewares/auth')
const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgotpassword', UserController.forgotPassword);
router.get('/verify/:confirmationCode', UserController.verify);
router.post('/password-rest/:resetCode', UserController.resetPassword);
router.get('/logout', UserController.logout);
router.post('/tokenIsValid', UserController.tokenIsValid);
router.get('/getCurrentUser', auth, UserController.getCurrentUser)
router.post('/explore', ExploreController.explore);
router.post('/createlisting', ListingController.create);

router.post('/changeUsername', UserController.changeUsername)
router.post('/sendVerification', UserController.sendVerification)
router.post('/changeEmail', UserController.changeEmail)
router.post('/changePassword', UserController.changePassword)
router.post('/uploadAvatar', UserController.uploadAvatar)

module.exports = router;
