const router = require('express').Router();
const multer = require('multer');

const uploadController = require("../../controllers/admin/upload.controller");

const cloudinaryHelper = require("../../helpers/cloudinary.helper");

const upload = multer({ storage: cloudinaryHelper.storage });

// mặc định timymce gửi bằng post , form name :"file"
router.post(
    '/image',
    upload.single('file'),
    uploadController.imagePost
)

module.exports = router;
