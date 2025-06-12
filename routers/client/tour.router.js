const route = require("express").Router()
// Controllers
const tourController = require("../../controllers/client/tour.controller")

route.get('/detail/:slug', tourController.detail)



module.exports = route;