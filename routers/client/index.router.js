const route = require("express").Router()

// Routers con
const tourRouter = require("./tour.router")
const homeRouter = require("./home.router")
const cartRouter = require("./cart.router")

route.use('/tours', tourRouter)
route.use('/', homeRouter)
route.use('/carts', cartRouter)


module.exports = route;