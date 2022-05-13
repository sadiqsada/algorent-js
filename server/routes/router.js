const express = require('express');
const UserController = require('../controllers/user');
const HouseController = require('../controllers/house');
const auth = require('../middlewares/auth');
const ListingController = require('../controllers/listing');
const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgotpassword', UserController.forgotPassword);
router.get('/verify/:confirmationCode', UserController.verify);
router.post('/password-rest/:resetCode', UserController.resetPassword);
router.get('/logout', UserController.logout);
router.post('/tokenIsValid', UserController.tokenIsValid);
router.get('/getUser', auth, UserController.getUser);

router.post('/sharpen', HouseController.sharpen)
router.post('/explore', HouseController.explore);
router.post('/shortlist', auth, HouseController.shortlist);
router.get('/getShortlist', auth, HouseController.getShortlist);
router.post('/recentlyViewed', auth, HouseController.recentlyViewed);
router.get('/getRecentlyViewed', auth, HouseController.getRecentlyViewed);
router.post('/createlisting', ListingController.create);

module.exports = router;
