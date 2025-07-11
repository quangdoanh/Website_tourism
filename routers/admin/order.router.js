const route = require("express").Router()

//Controllers
const orderController = require("../../controllers/admin/order.controller")
// end Controllers
route.get('/list', orderController.list);
route.get('/edit/:id', orderController.edit);

route.patch('/edit/:id', orderController.editPatch)

route.patch('/delete/:id', orderController.deletePatch)


// Thùng rác
route.get('/trash', orderController.trash);
route.patch('/undo/:id', orderController.undoPatch)
route.delete('/delete-destroy/:id', orderController.deleteDestroyDelete)

module.exports = route;