const route = require("express").Router()

//Controllers
const dashboardController = require("../../controllers/admin/dashboard.controller")
// end Controllers
route.get('/', dashboardController.dashboard);

route.post('/revenue-chart', dashboardController.revenueChartPost)

module.exports = route;