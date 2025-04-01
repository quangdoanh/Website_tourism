const route = require("express").Router()

// Routers con
const accountRouter = require("./account.router")
const dashboardRouter = require("./dashboard.router")
const categorydRouter = require("./category.router")
const tourRouter = require("./tour.router")
const orderRouter = require("./order.router")
const userRouter = require("./user.router")

route.use('/account', accountRouter);
route.use('/dashboard', dashboardRouter);
route.use('/category', categorydRouter);
route.use('/tour', tourRouter);
route.use('/order', orderRouter);
route.use('/user', userRouter);



module.exports = route;