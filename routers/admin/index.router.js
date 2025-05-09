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
const authMiddleware = require("../../middlewares/admin/auth.middlewares")

// NOT SAVE MEMORY CACHE
route.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    next();
})

// 

route.use('/account', accountRouter);
route.use('/dashboard', authMiddleware.verifyToken, dashboardRouter);
route.use('/category', authMiddleware.verifyToken, categorydRouter);
route.use('/tour', authMiddleware.verifyToken, tourRouter);
route.use('/order', authMiddleware.verifyToken, orderRouter);
route.use('/user', authMiddleware.verifyToken, userRouter);
route.use('/contact', authMiddleware.verifyToken, contactRouter);
route.use('/setting', authMiddleware.verifyToken, settingRouter);
route.use('/profile', authMiddleware.verifyToken, profileRouter);

// 404 Not Found
route.get('*', (req, res) => {
    res.render('admin/pages/error-404', {
        pageTitle: "404 NOT FOUND"
    })
});



module.exports = route;