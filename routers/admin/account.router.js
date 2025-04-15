const router = require("express").Router()

//Controllers
const accountController = require("../../controllers/admin/account.controller")
// end Controllers

// Validates
const validateAccount = require("../../validates/account.validate")
// End

router.get('/login', accountController.login)
router.get('/register', accountController.registerGet)

router.post('/register',
    validateAccount.registerPost,
    accountController.registerPost)
router.post('/login',
    validateAccount.loginPost,
    accountController.loginPost)


router.post('/register-initial', accountController.registerInitial)
router.get('/forgot-password', accountController.forgotPassword)
router.get('/otp-password', accountController.otpPassword)
router.get('/reset-password', accountController.resetPassword)

router.post('/logout', accountController.logoutPost)
module.exports = router;

