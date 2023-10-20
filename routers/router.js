const express = require('express')
const control = require('../controllers/controller')
const userauthentication = require('../middleware/auth')

const router = express.Router()

router.post('/signup', control.signup)
router.post('/login-details', control.loginPage)
router.post('/postExpense',userauthentication.authenticate, control.postExpense)
router.delete('/deleteExpense/:id',userauthentication.authenticate, control.deleteExpense)
router.get('/getExpense', userauthentication.authenticate, control.getExpense)

module.exports = router