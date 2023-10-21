const express = require('express')
const control = require('../controllers/controller')
const purchaseControl = require('../controllers/purchase')
const userauthentication = require('../middleware/auth')

const router = express.Router()

router.post('/signup', control.signup)
router.post('/login-details', control.loginPage)

router.post('/postExpense',userauthentication.authenticate, control.postExpense)
router.delete('/deleteExpense/:id',userauthentication.authenticate, control.deleteExpense)
router.get('/getExpense', userauthentication.authenticate, control.getExpense)

router.get('/purchase/premiummembership', userauthentication.authenticate,purchaseControl.purchasepremium)
router.post('/purchase/updatetransactionstatus', userauthentication.authenticate,purchaseControl.updateTransactionStatus)
router.post('/purchase/failedTransactionStatus', userauthentication.authenticate,purchaseControl.updateTransactionFailed)

module.exports = router