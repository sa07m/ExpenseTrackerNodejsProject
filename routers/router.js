const express = require('express')
const control = require('../controllers/controller')

const router = express.Router()

router.post('/signup', control.signup)
router.post('/login-details', control.loginPage)
router.post('/postExpense', control.postExpense)
router.delete('/deleteExpense/:id', control.deleteExpense)
router.get('/getExpense', control.getExpense)

module.exports = router