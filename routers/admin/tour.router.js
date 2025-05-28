const route = require("express").Router()

// Helper
const cloudinaryHelper = require("../../helpers/cloudinary.helper")
// 
//Controllers
const tourController = require("../../controllers/admin/tour.controller")
// end Controllers

const multer = require('multer');

const tourValidate = require("../../validates/tour.validate");

const upload = multer({ storage: cloudinaryHelper.storage });


route.get('/list', tourController.list);

route.get('/create', tourController.create);

route.post(
    '/create',
    upload.single('avatar'),
    tourValidate.createPost,
    tourController.createPost
)

route.get('/edit/:id', tourController.edit);

route.patch(
    '/edit/:id',
    upload.single('avatar'),
    tourValidate.createPost,
    tourController.editPatch
)
route.patch('/delete/:id', tourController.deletePatch)

route.get('/trash', tourController.trash);

route.patch('/undo/:id', tourController.undoPatch)

route.patch('/delete-destroy/:id', tourController.deleteDestroyPatch)

route.patch('/change-multi', tourController.changeMultiPatch)

route.patch('/trash/change-multi', tourController.trashChangeMultiPatch)

module.exports = route;