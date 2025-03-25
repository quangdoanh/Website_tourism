// Models
const Tour = require("../../models/tour.model")

module.exports.home = (req, res) => {

    res.render('clients/pages/home.pug', {
        pageTitle: "Doanh dep zai so 1"
    })
}
