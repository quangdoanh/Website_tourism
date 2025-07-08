const route = require("express").Router()

//Controllers
const contactController = require("../../controllers/admin/contact.controller")
// end Controllers
route.get('/list', contactController.list);
route.patch('/delete/:id', contactController.deletePatch);
route.get('/trash', contactController.trash);

route.patch('/undo/:id', contactController.undoPatch);

route.patch('/delete-destroy/:id', contactController.deleteDestroyDelete);

route.patch('/change-multi', contactController.changeMultiPatch)

route.patch('/trash/change-multi', contactController.trashChangeMultiPatch)
module.exports = route;