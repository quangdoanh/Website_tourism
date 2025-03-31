// Models
const Tour = require("../../models/tour.model")

module.exports.login = (req, res) => {

    res.render('admin/pages/login.pug', {
        pageTitle: "Trang login"
    })
}
module.exports.register = (req, res) => {

    res.render('admin/pages/register.pug', {
        pageTitle: "Trang register"
    })
}
module.exports.forgotPassword = (req, res) => {

    res.render('admin/pages/forgot-password.pug', {
        pageTitle: "Trang quên mật khẩu"
    })
}
module.exports.otpPassword = (req, res) => {

    res.render('admin/pages/otp-password.pug', {
        pageTitle: "Trang nhập mã OTP"
    })
}
module.exports.resetPassword = (req, res) => {

    res.render('admin/pages/reset-password.pug', {
        pageTitle: "Reset password"
    })
}
