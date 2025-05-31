const jwt = require('jsonwebtoken');
const AccountAdmin = require('../../models/accountAdmin.model');
const Role = require('../../models/role.model');

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

        //--- Cấp quyền những tài khoản không có quyền sẽ không vào được
        const roleInfor = await Role.findOne({
            _id: existAccount.role
        })

        if (roleInfor) {
            existAccount.roleName = roleInfor.name
        }
        //lấy thông tin account
        req.account = existAccount;
        console.log("filjs:", req.account)

        // gửi tên account về fe (bug)
        res.locals.account = existAccount
        console.log("filebug:", res.locals.account)



        next();
    } catch (error) {
        res.clearCookie("token");
        res.redirect(`/${pathAdmin}/account/login`);
    }

}