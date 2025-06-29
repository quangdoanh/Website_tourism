const route = require("express").Router()
const multer = require('multer');

const cloudinaryHelper = require("../../helpers/cloudinary.helper");

const upload = multer({ storage: cloudinaryHelper.storage });

//Controllers
const settingController = require("../../controllers/admin/setting.controller.js")
// end Controllers
route.get('/list', settingController.list);

route.get('/info', settingController.info);

route.patch(
    '/info',
    upload.fields(
        [
            { name: 'logo', maxCount: 1 },
            { name: 'favicon', maxCount: 1 }
        ]
    ),
    settingController.websiteInfoPatch
)

// Account

route.get('/account-admin/list', settingController.accountAdminlist);
route.get('/account-admin/create', settingController.accountAdmincreate);
route.post(
    '/account-admin/create',
    upload.single("avatar"),
    settingController.accountAdminCreatePost
)


route.get('/account-admin/edit/:id', settingController.accountAdminEdit)
route.patch(
    '/account-admin/edit/:id',
    upload.single("avatar"),
    settingController.accountAdminEditPatch
)
// Việt
route.patch('/account-admin/delete/:id', settingController.accountAdminDelete);
route.patch('/account-admin/change-multi', settingController.changeMultiAccountAdminPatch);
route.get('/account-admin/trash', settingController.accountAdminTrash)
route.patch('/account-admin/undo/:id', settingController.undoAccountAdminPatch)
route.patch('/account-admin/delete-destroy/:id', settingController.deleteDestroyPatch)
route.patch('/account-admin/trash/change-multi', settingController.trashAccountAdminChangeMultiPatch)


// Role
route.get('/role/list', settingController.Rolelist);

route.get('/role/create', settingController.RoleCreate);
route.post('/role/create', settingController.roleCreatePost)

route.get('/role/edit/:id', settingController.roleEdit)
route.patch('/role/edit/:id', settingController.roleEditPatch)
route.patch('/role/undo/:id', settingController.undoPatch)

route.patch('/role/delete-destroy/:id', settingController.deleteDestroyDelete)
route.patch('/role/delete/:id', settingController.roleDeletePatch)

route.get('/role/trash', settingController.roleTrash)
route.patch('/role/trash/change-multi', settingController.trashChangeMultiPatch)

route.patch('/role/change-multi', settingController.changeMultiPatch)




module.exports = route;