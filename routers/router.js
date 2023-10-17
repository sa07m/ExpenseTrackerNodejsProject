const express = require('express')
const control = require('../controllers/controller')

const router = express.Router()

router.post('/postSignupDetails', control.postDetails)
router.post('/login-details', control.loginPage)

module.exports = router