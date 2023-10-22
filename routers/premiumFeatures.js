const express = require('express')
const premiumFeatureController = require('../controllers/premiumFeature')
const authenticatemiddleware = require('../middleware/auth')

const router = express.Router()

router.get('/premium/showLeaderboard',authenticatemiddleware.authenticate,premiumFeatureController.getUserLeaderBoard)

module.exports = router