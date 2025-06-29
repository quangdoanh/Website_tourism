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
    const categoryIdSection9 = "68513b8d6ac55c5ebf02a564"; // id danh mục Tour  Nước Ngoài

    const listCategoryId4 = await categoryHelper.getAllSubcategoryIds(categoryIdSection4);
    const listCategoryId9 = await categoryHelper.getAllSubcategoryIds(categoryIdSection9);

    const tourListSection4 = await Tour
        .find({
            category: { $in: listCategoryId4 },
            deleted: false,
            status: "active"
        })
        .sort({
            position: "desc"
        })
    const tourListSection9 = await Tour
        .find({
            category: { $in: listCategoryId9 },
            deleted: false,
            status: "active"
        })
        .sort({
            position: "desc"
        })

    for (const item of tourListSection2) {
        item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    }
    for (const item of tourListSection4) {
        item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    }
    for (const item of tourListSection9) {
        item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    }

    console.log(tourListSection4)
    // End Section 4


    res.render('clients/pages/home.pug', {
        pageTitle: "Trang chủ",
        tourListSection2: tourListSection2,
        tourListSection4: tourListSection4,
        tourListSection9: tourListSection9
    })
}
