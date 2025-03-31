const router = require("express").Router()

//Controllers
const accountController = require("../../controllers/admin/account.controller")

// end Controllers

router.get('/login', accountController.login)
router.get('/register', accountController.register)
router.get('/forgot-password', accountController.forgotPassword)
router.get('/otp-password', accountController.otpPassword)
router.get('/reset-password', accountController.resetPassword)

module.exports = router;

