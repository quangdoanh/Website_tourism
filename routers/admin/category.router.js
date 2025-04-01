const route = require("express").Router()

//Controllers
const categoryController = require("../../controllers/admin/category.controller")
// end Controllers
route.get('/list', categoryController.list);
route.get('/create', categoryController.create);

module.exports = route;