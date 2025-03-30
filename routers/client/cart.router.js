const router = require("express").Router()

//Controllers
const cartController = require("../../controllers/client/cart.controller")
// end Controllers

router.get('/', cartController.cart)

module.exports = router;

