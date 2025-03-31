// Models
const Tour = require("../../models/tour.model")

module.exports.home = (req, res) => {

    res.render('clients/pages/home.pug', {
        pageTitle: "Trang chủ"
    })
}
