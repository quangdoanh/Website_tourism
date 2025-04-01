const route = require("express").Router()

//Controllers
const userController = require("../../controllers/admin/user.controller")
// end Controllers
route.get('/list', userController.list);

module.exports = route;