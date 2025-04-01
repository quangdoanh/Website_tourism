const route = require("express").Router()

//Controllers
const settingController = require("../../controllers/admin/setting.controller.js")
// end Controllers
route.get('/list', settingController.list);
route.get('/info', settingController.info);
route.get('/account-admin/list', settingController.accountAdminlist);
route.get('/account-admin/create', settingController.accountAdmincreate);
route.get('/role/list', settingController.Rolelist);
route.get('/role/create', settingController.Rolereate);


module.exports = route;