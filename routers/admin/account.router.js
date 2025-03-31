const router = require("express").Router()

//Controllers
const accountLoginController = require("../../controllers/admin/account.controller")
const accountRegisterController = require("../../controllers/admin/account.controller")
// end Controllers

router.get('/login', accountLoginController.login)
router.get('/register', accountRegisterController.register)

module.exports = router;

