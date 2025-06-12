// Models
const Tour = require("../../models/tour.model")
const moment = require("moment");
const categoryHelper = require("../../helpers/category.helper");

module.exports.home = async (req, res) => {

    // Section 2
    const tourListSection2 = await Tour
        .find({
            deleted: false,
            status: "active"
        })
        .sort({
            position: "desc"
        })
        .limit(6)

    // end

    // Section 4
    const categoryIdSection4 = "683efbc6f07620bea1842510"; // id danh mục Tour Trong Nước
    const listCategoryId = await categoryHelper.getAllSubcategoryIds(categoryIdSection4);

    const tourListSection4 = await Tour
        .find({
            category: { $in: listCategoryId },
            deleted: false,
            status: "active"
        })
        .sort({
            position: "desc"
        })
        .limit(8)

    for (const item of tourListSection2) {
        item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    }

    console.log(tourListSection4)
    // End Section 4


    res.render('clients/pages/home.pug', {
        pageTitle: "Trang chủ",
        tourListSection2: tourListSection2,
        tourListSection4: tourListSection4
    })
}
