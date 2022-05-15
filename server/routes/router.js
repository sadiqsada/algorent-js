const express = require('express');
const UserController = require('../controllers/user');
const HouseController = require('../controllers/house');
const auth = require('../middlewares/auth');
const ListingController = require('../controllers/listing');
const TransactionController = require('../controllers/transaction');
const OfferController = require('../controllers/offer');
const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgotpassword', UserController.forgotPassword);
router.get('/verify/:confirmationCode', UserController.verify);
router.post('/password-rest/:resetCode', UserController.resetPassword);
router.get('/logout', UserController.logout);
router.post('/tokenIsValid', UserController.tokenIsValid);
router.get('/getUser', auth, UserController.getUser);

// router.post('/sharpen', HouseController.sharpen)
router.post('/explore', HouseController.explore);
router.post('/shortlist', auth, HouseController.shortlist);
router.get('/getShortlist', auth, HouseController.getShortlist);
router.post('/recentlyViewed', auth, HouseController.recentlyViewed);
router.get('/getRecentlyViewed', auth, HouseController.getRecentlyViewed);
router.get('/getCurrentUser', auth, UserController.getCurrentUser);
router.post('/getHouseByID', HouseController.getHouseByID);
router.post('/createlisting', ListingController.create);

router.get('/transactions/createAccount', auth, TransactionController.createAccount);
// router.get('/transactions/createClient', TransactionController.createClient);
router.post('/transactions/checkBalance', TransactionController.checkBalance);
router.post(
  '/transactions/sendTransaction',
  TransactionController.sendTransaction
);
router.post('/transactions/addWallet', auth, TransactionController.addWallet);
router.get('/transactions/getWallets', auth, TransactionController.getWallets);
router.post('/transactions/selectWallet', auth, TransactionController.selectWallet);

router.post('/offer/addOffer', auth, OfferController.addOffer);
router.post('/offer/removeOffer', auth, OfferController.removeOffer);
router.get('/getReceivedOffers', auth, OfferController.getReceivedOffers);
router.post('/changeUsername', UserController.changeUsername);
router.post('/sendVerification', UserController.sendVerification);
router.post('/changeEmail', UserController.changeEmail);
router.post('/changePassword', UserController.changePassword);
router.post('/uploadAvatar', UserController.uploadAvatar);

module.exports = router;
