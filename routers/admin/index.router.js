const route = require("express").Router()

// Routers con
const accountRouter = require("./account.router")
const dashboardRouter = require("./dashboard.router")

route.use('/account', accountRouter);
route.use('/dashboard', dashboardRouter);



module.exports = route;