const route = require("express").Router()

// Routers con
const tourRouter = require("./tour.router")
const homeRouter = require("./home.router")
const cartRouter = require("./cart.router")
const contactRoutes = require("./contact.router");
const categoryRoutes = require("./category.router");
const searchRoutes = require("./search.router");
const orderRoutes = require("./order.router");

const settingMiddleware = require("../../middlewares/client/setting.middlewares");
const categoryMiddleware = require("../../middlewares/client/category.middleware");


route.use(settingMiddleware.websiteInfo);
route.use(categoryMiddleware.list);

route.use('/tour', tourRouter)
route.use('/', homeRouter)
route.use('/cart', cartRouter)
route.use('/contact', contactRoutes)
route.use('/category', categoryRoutes)
route.use('/search', searchRoutes)
route.use('/order', orderRoutes)

module.exports = route;