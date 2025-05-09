const jwt = require('jsonwebtoken');
const AccountAdmin = require('../../models/accountAdmin.model');


module.exports.verifyToken = async (req, res, next) => {


    try {
        const token = req.cookies.token; // lấy token ở cookies

        if (!token) {
            res.redirect(`/${pathAdmin}/account/login`);
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // xác thực token
        const { id, email } = decoded;

        const existAccount = await AccountAdmin.findOne({
            _id: id,
            email: email,
            status: "active"
        })

        if (!existAccount) {
            res.clearCookie("token");
            res.redirect(`/${pathAdmin}/account/login`);
            return;
        }
        //lấy thông tin account
        req.account = existAccount;

        // gửi tên account về fe (bug)
        res.locals.account = existAccount



        next();
    } catch (error) {
        res.clearCookie("token");
        res.redirect(`/${pathAdmin}/account/login`);
    }

}