const route = require("express").Router()

// Routers con
const accountRouter = require("./account.router")


route.use('/account', accountRouter);



module.exports = route;