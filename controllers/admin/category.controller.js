const Category = require("../../models/category.model")

const accountAdmin = require("../../models/accountAdmin.model")

const CategoryHelpers = require("../../helpers/category.helper")
const moment = require("moment/moment")

// ---------- List--------------
module.exports.list = async (req, res) => {

    const find = {
        deleted: false,
    }

    if (req.query.status) {
        find.status = req.query.status
    }
    if (req.query.name) {
        find.createdBy = req.query.name
    }

    const categoryList = await Category
        .find(find)
        .sort({
            position: "desc"
        })

    for (const item of categoryList) {
        if (item.createdBy) {
            const inforAccountCreated = await accountAdmin.findOne({
                _id: item.createdBy,
            })
            item.nameCeatedBy = inforAccountCreated.name;

        }

        if (item.updatedBy) {
            const inforAccountUpdate = await accountAdmin.findOne({
                _id: item.createdBy,
            })
            item.namedUpdatedBy = inforAccountUpdate.name;
        }

        item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
        item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
    }

    // Body
    const accountList = await accountAdmin.find({}).select("id name");


    res.render('admin/pages/category-list', {
        pageTitle: "Quản lý danh mục",
        categoryList: categoryList,
        accountAdmin: accountList
    })
}

// ------------Create-------------
module.exports.create = async (req, res) => {

    const categoryList = await Category.find({
        deleted: false
    })

    const categoryTree = CategoryHelpers.CategoryTree(categoryList)

    console.log(categoryTree)

    res.render('admin/pages/category-create', {
        pageTitle: "Tạo danh mục",
        categoryList: categoryTree
    })
}
module.exports.createPost = async (req, res) => {



    if (req.body.position) {
        req.body.position = parseInt(req.body.position)
    } else {
        const totalDocment = await Category.countDocuments({})
        req.body.position = totalDocment + 1
    }

    req.body.createdBy = req.account.id
    req.body.updatedBy = req.account.id



    // take photo in cloud
    req.body.avatar = req.file ? req.file.path : ""


    const newRecord = new Category(req.body);
    await newRecord.save();

    req.flash("success", "Tạo danh mục thành công!");

    res.json({
        code: "success"
    })


}
// --------------Edit-----------------
module.exports.edit = async (req, res) => {

    try {
        const categoryList = await Category.find({
            deleted: false
        })

        const categoryTree = CategoryHelpers.CategoryTree(categoryList);

        const id = req.params.id;

        const categoryDetail = await Category.findOne({
            _id: id,
            deleted: false
        })

        res.render("admin/pages/category-edit", {
            pageTitle: "Chỉnh sửa danh mục",
            categoryList: categoryTree,
            categoryDetail: categoryDetail
        })
    } catch (error) {
        req.flash("error", "danh mục bị lỗi id !");
        res.redirect(`/${pathAdmin}/category/list`)
    }

}

module.exports.editPatch = async (req, res) => {

    try {
        const id = req.params.id

        if (req.body.position) {
            req.body.position = parseInt(req.body.position)
        } else {
            delete req.body.position
        }

        req.body.updatedBy = req.account.id



        // take photo in cloud
        if (req.file) {
            req.body.avatar = req.file.path;
        } else {
            delete req.body.avatar;
        }

        // updata Model

        await Category.updateOne({
            _id: id,
            deleted: false
        }, req.body)

        req.flash("success", "Sửa danh mục thành công!");

        res.json({
            code: "success"
        })
    } catch (error) {
        req.flash("error", "Sửa danh mục thất bại!");
    }


}

// --------------- Delete --------------
module.exports.deletedPatch = async (req, res) => {

    try {
        const id = req.params.id
        // deleted Model

        await Category.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedBy: req.account.id,
            deletedAt: Date.now()

        })

        req.flash("success", "Xóa danh mục thành công!");

        res.json({
            code: "success"
        })
    } catch (error) {
        req.flash("error", "Xóa danh mục thất bại!");
    }
}