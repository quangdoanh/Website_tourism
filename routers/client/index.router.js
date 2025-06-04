const route = require("express").Router()

// Routers con
const tourRouter = require("./tour.router")
const homeRouter = require("./home.router")
const cartRouter = require("./cart.router")

const settingMiddleware = require("../../middlewares/client/setting.middlewares");
const categoryMiddleware = require("../../middlewares/client/category.middleware");

route.use(settingMiddleware.websiteInfo);
route.use(categoryMiddleware.list);

route.use('/tours', tourRouter)
route.use('/', homeRouter)
route.use('/carts', cartRouter)


module.exports = route;