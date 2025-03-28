const route = require("express").Router()
// Controllers
const tourController = require("../../controllers/client/tour.controller")

route.get('/', tourController.list)

module.exports = route;