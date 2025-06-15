const router = require('express').Router();

const orderController = require("../../controllers/client/order.controller");

router.get('/success', orderController.success)

router.post('/create', orderController.createPost)

module.exports = router;
