// Models
const Tour = require("../../models/tour.model")

module.exports.cart = (req, res) => {

    res.render('clients/pages/cart', {
        pageTitle: "Trang giỏ hàng"
    })
}