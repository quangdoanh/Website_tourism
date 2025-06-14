const router = require("express").Router()

//Controllers
const cartController = require("../../controllers/client/cart.controller")
// end Controllers

router.get('/', cartController.cart)

router.post('/detail', cartController.detail)

module.exports = router;

