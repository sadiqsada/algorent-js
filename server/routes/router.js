const express = require('express');
const router = express.Router();
const ExploreController = require('../controllers/explore');

router.post('/explore', ExploreController.explore);

module.exports = router;