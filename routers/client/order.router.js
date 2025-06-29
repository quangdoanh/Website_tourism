const router = require('express').Router();

const orderController = require("../../controllers/client/order.controller");

router.get('/success', orderController.success)

router.post('/create', orderController.createPost)

router.get('/payment-zalopay', orderController.paymentZaloPay)

router.post('/payment-zalopay-result', orderController.paymentZaloPayResultPost)


module.exports = router;
