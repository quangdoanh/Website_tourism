const route = require("express").Router()

// Routers con
const accountRouter = require("./account.router")
const dashboardRouter = require("./dashboard.router")
const categorydRouter = require("./category.router")
const tourRouter = require("./tour.router")

route.use('/account', accountRouter);
route.use('/dashboard', dashboardRouter);
route.use('/category', categorydRouter);
route.use('/tour', tourRouter);



module.exports = route;