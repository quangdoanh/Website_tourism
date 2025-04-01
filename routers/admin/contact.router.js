const route = require("express").Router()

//Controllers
const contactController = require("../../controllers/admin/contact.controller")
// end Controllers
route.get('/list', contactController.list);

module.exports = route;