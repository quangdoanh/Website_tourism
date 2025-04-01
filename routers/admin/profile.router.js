const route = require("express").Router()

//Controllers
const profileController = require("../../controllers/admin/profile.controller")
// end Controllers
route.get('/edit', profileController.edit);
route.get('/change-password', profileController.changePassword);

module.exports = route;