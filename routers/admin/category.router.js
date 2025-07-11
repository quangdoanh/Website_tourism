const route = require("express").Router()

// Validates
const validateCategory = require("../../validates/category.validate")
// End validates

const multer = require('multer');

const cloudinaryHelper = require("../../helpers/cloudinary.helper");

const upload = multer({ storage: cloudinaryHelper.storage });


//Controllers
const categoryController = require("../../controllers/admin/category.controller")
// end Controllers
route.get('/list', categoryController.list);

route.get('/create', categoryController.create);
route.post('/create',
  upload.single('avatar'),
  validateCategory.createPost,
  categoryController.createPost);

route.get('/edit/:id', categoryController.edit);

route.patch('/edit/:id',
  upload.single('avatar'),
  validateCategory.createPost,
  categoryController.editPatch);

route.patch('/delete/:id', categoryController.deletedPatch);

route.patch('/change-multi', categoryController.changeMultiPatch)


route.get('/trash', categoryController.trash)

route.patch('/undo/:id', categoryController.undoPatch)

route.patch('/permanently-delete/:id', categoryController.permanentlyDeletePatch)

route.patch('/trash/change-multi', categoryController.trashChangeMultiPatch)

module.exports = route;