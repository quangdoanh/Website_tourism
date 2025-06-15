const route = require("express").Router()

//Controllers
const orderController = require("../../controllers/admin/order.controller")
// end Controllers
route.get('/list', orderController.list);
route.get('/edit/:id', orderController.edit);

route.patch('/edit/:id', orderController.editPatch)

module.exports = route;