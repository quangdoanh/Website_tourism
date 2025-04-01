module.exports.list = (req, res) => {

    res.render('admin/pages/order-list', {
        pageTitle: "Danh sách order"
    })
}
module.exports.edit = (req, res) => {

    res.render('admin/pages/order-edit', {
        pageTitle: "Trang sửa order"
    })
}
