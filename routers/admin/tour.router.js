const route = require("express").Router()

//Controllers
const tourController = require("../../controllers/admin/tour.controller")
// end Controllers
route.get('/list', tourController.list);
route.get('/create', tourController.create);
route.get('/trash', tourController.trash);

module.exports = route;