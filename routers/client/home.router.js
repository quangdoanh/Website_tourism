const router = require("express").Router()

//Controllers
const homeController = require("../../controllers/client/home.controller")
// end Controllers

router.get('/', homeController.home)

module.exports = router;

