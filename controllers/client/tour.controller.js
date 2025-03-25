// Models
const Tour = require("../../models/tour.model")

module.exports.list = async (req, res) => {
    const tourList = await (Tour.find({}));

    console.log(tourList);

    res.render('clients/pages/tour-list', {
        pageTitle: "Doanh dep zai",
        tourList: tourList
    })
}