const SettingWebsiteInfo = require('../../models/setting-website-info.model')
const Role = require('../../models/role.model')

const permissionConfig = require("../../config/permissionList");

const slugify = require('slugify');
slugify.extend({ 'đ': 'd', 'Đ': 'D' }); // tránh d thành ds




module.exports.list = (req, res) => {

    res.render('admin/pages/setting-list', {
        pageTitle: "Cài đặt chung"
    })
}
//      website infor
module.exports.info = async (req, res) => {

    const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

    console.log(settingWebsiteInfo);
    res.render('admin/pages/setting-website-info', {
        pageTitle: "Thông tin website",
        settingWebsiteInfo: settingWebsiteInfo
    })
}

module.exports.websiteInfoPatch = async (req, res) => {
    if (req.files && req.files.logo) {
        req.body.logo = req.files.logo[0].path;
    } else {
        delete req.body.logo;
    }

    if (req.files && req.files.favicon) {
        req.body.favicon = req.files.favicon[0].path;
    } else {
        delete req.body.favicon;
    }

    const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

    if (settingWebsiteInfo) {
        await SettingWebsiteInfo.updateOne({
            _id: settingWebsiteInfo.id
        }, req.body)
    } else {
        const newRecord = new SettingWebsiteInfo(req.body);
        await newRecord.save();
    }

    req.flash("success", "Cập nhật thành công infor !")

    res.json({
        code: "success"
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

// Role
module.exports.Rolelist = async (req, res) => {
    const find = {
        deleted: false
    }

    // Tìm kiếm

    if (req.query.keyword) {
        const keyword = slugify(req.query.keyword, {
            lower: true
        });
        const keywordRegex = new RegExp(keyword);

        console.log("role", keywordRegex)

        find.slug = keywordRegex;
    }



    const roleList = await Role
        .find(find)

    res.render('admin/pages/setting-role-list', {
        pageTitle: "Nhóm quyền",
        roleList: roleList
    })
}
// Change Multil
module.exports.changeMultiPatch = async (req, res) => {
    try {
        const { option, ids } = req.body;

        switch (option) {
            case "delete":
                await Role.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                    deletedBy: req.account.id,
                    deletedAt: Date.now()
                });
                req.flash("success", "Chuyển vào thùng rác!");
                break;
        }

        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không tồn tại trong hệ thông!"
        })
    }


}
// Create
module.exports.RoleCreate = (req, res) => {

    res.render('admin/pages/setting-role-create', {
        pageTitle: "Tạo nhóm quyền",
        permissionList: permissionConfig.permissionList
    })
}

module.exports.roleCreatePost = async (req, res) => {
    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;

    const newRecord = new Role(req.body);
    await newRecord.save();

    req.flash("success", "Tạo nhóm quyền thành công!");

    res.json({
        code: "success"
    })
}

// Edit
module.exports.roleEdit = async (req, res) => {
    try {
        const id = req.params.id;

        const roleDetail = await Role.findOne({
            _id: id,
            deleted: false
        })

        if (roleDetail) {
            res.render("admin/pages/setting-role-edit", {
                pageTitle: "Chỉnh sửa nhóm quyền",
                permissionList: permissionConfig.permissionList,
                roleDetail: roleDetail
            })
        } else {
            res.redirect(`/${pathAdmin}/setting/role/list`);
        }
    } catch (error) {
        res.redirect(`/${pathAdmin}/setting/role/list`);
    }
}

module.exports.roleEditPatch = async (req, res) => {
    try {
        const id = req.params.id;

        req.body.updatedBy = req.account.id;

        await Role.updateOne({
            _id: id,
            deleted: false
        }, req.body)

        req.flash("success", "Cập nhật nhóm quyền thành công!");

        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không tồn tại!"
        })
    }
}
module.exports.undoPatch = async (req, res) => {
    try {
        const id = req.params.id;

        await Role.updateOne({
            _id: id
        }, {
            deleted: false
        })

        req.flash("success", "Khôi phục role thành công!");

        res.json({
            code: "success"
        })
    } catch (error) {
        req.flash("error", "Khôi phục thất bại!");
    }
}

// Delete
module.exports.roleDeletePatch = async (req, res) => {
    try {
        const id = req.params.id;

        req.body.deleteddBy = req.account.id;

        await Role.updateOne({
            _id: id,
            deleted: false
        }, {
            deleted: true,
            deletedBy: req.account.id,
            deletedAt: Date.now()

        })

        req.flash("success", "Chuyển nhóm quyền vào thùng rác thành công!");

        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không tồn tại!"
        })
    }
}

module.exports.deleteDestroyDelete = async (req, res) => {
    try {
        const id = req.params.id

        await Role.deleteOne({
            _id: id
        })

        req.flash("success", "Xóa role thành công")
        res.json({
            code: "success"
        })
    } catch (error) {
        req.flash("error", "Khôi phục thất bại!");
    }
}

// Trash
module.exports.roleTrash = async (req, res) => {

    const find = {
        deleted: true
    }

    // Tìm kiếm

    if (req.query.keyword) {
        const keyword = slugify(req.query.keyword, {
            lower: true
        });
        const keywordRegex = new RegExp(keyword);

        console.log("role", keywordRegex)

        find.slug = keywordRegex;
    }



    const roleList = await Role
        .find(find)

    res.render('admin/pages/setting-role-trash', {
        pageTitle: "Thùng rác",
        roleList: roleList
    })
}

module.exports.trashChangeMultiPatch = async (req, res) => {
    try {
        const { option, ids } = req.body;

        console.log(" role chạy vao đây")
        switch (option) {
            case "undo":
                await Role.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: false
                });
                req.flash("success", "Khôi phục thành công!");
                break;
            case "delete-destroy":
                await Role.deleteMany({
                    _id: { $in: ids }
                });
                req.flash("success", "Xóa viễn viễn thành công!");
                break;
        }

        res.json({
            code: "success"
        })
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không tồn tại trong hệ thông!"
        })
    }
}



