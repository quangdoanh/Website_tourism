module.exports.list = (req, res) => {

    res.render('admin/pages/user-list', {
        pageTitle: "Danh sách người dùng"
    })
}
module.exports.edit = (req, res) => {

    res.render('admin/pages/order-edit', {
        pageTitle: "Trang sửa order"
    })
}
