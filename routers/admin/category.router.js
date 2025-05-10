const route = require("express").Router()

const multer = require('multer');

const cloudinaryHelper = require("../../helpers/cloudinary.helper");

const upload = multer({ storage: cloudinaryHelper.storage });


//Controllers
const categoryController = require("../../controllers/admin/category.controller")
// end Controllers
route.get('/list', categoryController.list);
route.get('/create', categoryController.create);
route.post('/create', upload.single('avatar'), categoryController.createPost);

module.exports = route;