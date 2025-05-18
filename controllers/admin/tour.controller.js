// Models
const Tour = require("../../models/tour.model")
const Category = require("../../models/category.model")
const City = require("../../models/city.model")
//
// helpers
const CategoryHelpers = require("../../helpers/category.helper")
// --


//----------List---------
module.exports.list = (req, res) => {



    res.render('admin/pages/tour-list', {
        pageTitle: "Danh sách tour"
    })
}

// --------- Create ------
module.exports.create = async (req, res) => {

    const categoryList = await Category.find({
        deleted: false
    });

    const city = await City.find({})

    const categoryTree = CategoryHelpers.CategoryTree(categoryList)

    res.render('admin/pages/tour-create', {
        pageTitle: "Trang tạo tour",
        categoryList: categoryTree,
        city: city
    })
}

module.exports.createPost = async (req, res) => {
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const totalRecord = await Tour.countDocuments({});
        req.body.position = totalRecord + 1;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    req.body.avatar = req.file ? req.file.path : "";

    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockAdult ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.locations ? JSON.parse(req.body.schedules) : [];

    const newRecord = new Tour(req.body);
    await newRecord.save();

    req.flash("success", "Tạo tour thành công!")

    res.json({
        code: "success"
    })

}
module.exports.trash = (req, res) => {

    res.render('admin/pages/tour-trash', {
        pageTitle: "Trang thùng rác tour"
    })
}