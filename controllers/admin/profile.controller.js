const AccountAdmin = require("../../models/accountAdmin.model");
const Role = require('../../models/role.model');

const bcrypt = require("bcryptjs");

module.exports.edit = async (req, res) => {

    const id = req.account.id;

    const accountAdminDetail = await AccountAdmin.findOne({
        _id: id
    })

    const roleInfo = await Role.findOne({
        _id: accountAdminDetail.role
    })



    if (roleInfo) {
        accountAdminDetail.roleName = roleInfo.name
    }


    res.render('admin/pages/profile-edit', {
        pageTitle: "Thông tin cá nhân",
        accountAdminDetail: accountAdminDetail
    })
}

module.exports.editPatch = async (req, res) => {
    try {
        const id = req.account.id;

        req.body.updatedBy = req.account.id;
        if (req.file) {
            req.body.avatar = req.file.path;
        } else {
            delete req.body.avatar;
        }

        await AccountAdmin.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        req.flash('success', 'Cập nhật thông tin thành công!');

        res.json({
            code: "success"
        });
    } catch (error) {
        res.json({
            code: "error",
            message: error
        });
    }
}


module.exports.changePassword = (req, res) => {

    res.render('admin/pages/profile-change-password', {
        pageTitle: "Đổi mật khẩu"
    })
}

module.exports.changePasswordPatch = async (req, res) => {
    try {
        const id = req.account.id;

        req.body.updatedBy = id;

        // Mã hóa mật khẩu với bcrypt
        const salt = await bcrypt.genSalt(10); // Tạo ra chuỗi ngẫu nhiên có 10 ký tự
        req.body.password = await bcrypt.hash(req.body.password, salt);

        await AccountAdmin.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        req.flash("success", "Đổi mật khẩu thành công!");

        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: error
        })
    }
}



