module.exports.list = (req, res) => {

    res.render('admin/pages/setting-list', {
        pageTitle: "Cài đặt chung"
    })
}
module.exports.info = (req, res) => {

    res.render('admin/pages/setting-website-info', {
        pageTitle: "Thông tin website"
    })
}
module.exports.accountAdminlist = (req, res) => {

    res.render('admin/pages/setting-account-admin-list', {
        pageTitle: "Tài khoản quản trị"
    })
}
module.exports.accountAdmincreate = (req, res) => {

    res.render('admin/pages/setting-account-admin-create', {
        pageTitle: "Tạo tài khoản quản tr"
    })
}
module.exports.Rolelist = (req, res) => {

    res.render('admin/pages/setting-role-list', {
        pageTitle: "Nhóm quyền"
    })
}
module.exports.Rolereate = (req, res) => {

    res.render('admin/pages/setting-role-create', {
        pageTitle: "Tạo nhóm quyền"
    })
}

