const route = require("express").Router()

const multer = require('multer');
const upload = multer();

//Controllers
const categoryController = require("../../controllers/admin/category.controller")
// end Controllers
route.get('/list', categoryController.list);
route.get('/create', categoryController.create);
route.post('/create', upload.single('avatar'), categoryController.createPost);

module.exports = route;