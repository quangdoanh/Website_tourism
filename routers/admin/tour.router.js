const route = require("express").Router()

// Helper
const cloudinaryHelper = require("../../helpers/cloudinary.helper")
// 
//Controllers
const tourController = require("../../controllers/admin/tour.controller")
// end Controllers

const multer = require('multer');

const tourValidate = require("../../validates/tour.validate");

const upload = multer({ storage: cloudinaryHelper.storage });


route.get('/list', tourController.list);

route.get('/create', tourController.create);

route.post(
    '/create',
    upload.single('avatar'),
    tourValidate.createPost,
    tourController.createPost
)



route.get('/trash', tourController.trash);

module.exports = route;