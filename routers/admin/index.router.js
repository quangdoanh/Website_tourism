const route = require("express").Router()

// Routers con
const accountRouter = require("./account.router")
const dashboardRouter = require("./dashboard.router")
const categorydRouter = require("./category.router")
const tourRouter = require("./tour.router")
const orderRouter = require("./order.router")
const userRouter = require("./user.router")
const contactRouter = require("./contact.router")
const settingRouter = require("./setting.router")
const profileRouter = require("./profile.router")

route.use('/account', accountRouter);
route.use('/dashboard', dashboardRouter);
route.use('/category', categorydRouter);
route.use('/tour', tourRouter);
route.use('/order', orderRouter);
route.use('/user', userRouter);
route.use('/contact', contactRouter);
route.use('/setting', settingRouter);
route.use('/profile', profileRouter);

// 404 Not Found
route.get('*', (req, res) => {
    res.render('admin/pages/error-404', {
        pageTitle: "404 NOT FOUND"
    })
});



module.exports = route;