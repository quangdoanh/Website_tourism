module.exports.list = (req, res) => {

    res.render('admin/pages/tour-list', {
        pageTitle: "Danh sách tour"
    })
}
module.exports.create = (req, res) => {

    res.render('admin/pages/tour-create', {
        pageTitle: "Trang tạo tour"
    })
}
module.exports.trash = (req, res) => {

    res.render('admin/pages/tour-trash', {
        pageTitle: "Trang thùng rác tour"
    })
}