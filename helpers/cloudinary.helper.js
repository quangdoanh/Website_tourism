const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: 'dozkrvhnl',
    api_key: '627585337765482',
    api_secret: 'qd6IJMeYtquKE3tEf302tnPbF3w' // Click 'View API Keys' above to copy your API secret
});
module.exports.storage = new CloudinaryStorage({
    cloudinary: cloudinary,
})