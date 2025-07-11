const route = require("express").Router()

//Controllers
const userController = require("../../controllers/admin/user.controller")
// end Controllers
route.get('/list', userController.list);
route.get('/edit/:id', userController.edit);
route.patch('/edit/:id', userController.editPatch);
route.patch('/delete/:id', userController.deletePatch);
route.patch('/change-multi', userController.changeMultiPatch);
route.get('/trash', userController.trash);
route.patch('/undo/:id', userController.undoPatch)
route.delete('/delete-destroy/:id', userController.deleteDestroyPatch)
route.patch('/trash/change-multi', userController.trashChangeMultiPatch)

module.exports = route;