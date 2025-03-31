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
