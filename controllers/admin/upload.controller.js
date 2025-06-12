module.exports.imagePost = async (req, res) => {

    console.log(req.file.path);
    // timymce sẽ có object trường location để trả về link ảnh
    res.json({
        location: req.file.path
    })
}
