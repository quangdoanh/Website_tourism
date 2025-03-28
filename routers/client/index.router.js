const route = require("express").Router()

// Routers con
const tourRouter = require("./tour.router")
const homeRouter = require("./home.router")

route.use('/tours', tourRouter)
route.use('/', homeRouter)


module.exports = route;