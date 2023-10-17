const express = require('express')
const control = require('../controllers/controller')

const router = express.Router()

router.post('/signup', control.signup)
router.post('/login-details', control.loginPage)

module.exports = router