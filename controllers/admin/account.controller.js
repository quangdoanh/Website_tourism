// Models
const Tour = require("../../models/tour.model")
const accountAdmin = require("../../models/accountAdmin.model")

// Mã hóa mật khẩu
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken")

module.exports.login = (req, res) => {

    res.render('admin/pages/login.pug', {
        pageTitle: "Trang login"
    })
}
module.exports.registerGet = (req, res) => {

    res.render('admin/pages/register.pug', {
        pageTitle: "Trang register"
    })
}
module.exports.registerPost = async (req, res) => {

    const { name, email, password } = req.body;

    const existEmail = await accountAdmin.findOne({
        email: email
    });

    if (existEmail) {
        res.json({
            code: "error",
            message: "Email đã tồn tại"
        })
        return
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);


    const newAdmin = new accountAdmin({
        name: name,
        email: email,
        password: hashedPassword,
        status: "intitial"
    })

    await newAdmin.save();

    res.json({
        code: "success",
        message: "Đăng ký thành công"
    })


}
module.exports.loginPost = async (req, res) => {

    const { email, password } = req.body;

    const existAccount = await accountAdmin.findOne({
        email: email
    });

    if (!existAccount) {
        res.json({
            code: "error",
            message: "Email or Password wrong"
        })
        return
    }

    const isPassword = await bcrypt.compare(password, existAccount.password);

    if (!isPassword) {
        res.json({
            code: "error",
            message: "Email or Password wrong"
        })
        return
    }


    if (existAccount.status != "active") {
        res.json({
            code: "error",
            message: "Tai khoan chua duoc kich hoat"
        })
        return
    }

    const token = ({
        id: existAccount.id,
        email: existAccount.email
    },
        process.env.JWT_SECRET,
    {
        expiresIn: '1d' // Token có thời hạn 1 ngày
    })

    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, // Token có hiệu lực trong 1 ngày
        httpOnly: true,
        sameSite: "strict"
    })


    res.json({
        code: "success",
        message: "Đăng ký thành công"
    })

}

module.exports.logoutPost = (req, res) => {

    console.log("chạy vào đay")

    res.clearCookie("token");

    res.json({
        code: "success",
        message: "Đăng xuất thành công"
    })
}
module.exports.registerInitial = (req, res) => {

    res.render('admin/pages/register-initial.pug', {
        pageTitle: "Trang chờ phê duyệt tài khoản"
    })
}
module.exports.forgotPassword = (req, res) => {

    res.render('admin/pages/forgot-password.pug', {
        pageTitle: "Trang quên mật khẩu"
    })
}
module.exports.otpPassword = (req, res) => {

    res.render('admin/pages/otp-password.pug', {
        pageTitle: "Trang nhập mã OTP"
    })
}
module.exports.resetPassword = (req, res) => {

    res.render('admin/pages/reset-password.pug', {
        pageTitle: "Reset password"
    })
}
