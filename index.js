const express = require('express')
const path = require('path')

// tải các biến môi trường từ file .env vào biến môi trường của Node.js
require('dotenv').config()

//Lấy biến token
const cookieParser = require('cookie-parser');
// End

// thông báo flash 
const flash = require('express-flash');
const session = require('express-session');

// end

// Kết nối dabase
const database = require("./config/database.config")
database.connect();
//end

// Kết nối variable 
const variableConfig = require("./config/variable.config")
// end

const app = express();
const port = 3000;

// Tạo biến toàn cục cho PUG
app.locals.adminPathName = variableConfig.pathAdmin
// end

// Tạo biến toàn cục cho các file be
global.pathAdmin = variableConfig.pathAdmin;
// end

// Cho phép gửi file json lên be
app.use(express.json());
// End

// lấy token
app.use(cookieParser("SFGWHSDSGSDSD"));
// end

// Nhúng Flash
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// end

// Routers
const adminRouters = require("./routers/admin/index.router")
const clientRouters = require("./routers/client/index.router")
// End Routers


// Thiết lập views
app.set('views', path.join(__dirname, "views")); // Nói cho Express biết nơi chứa các file giao diện .pug  ----Ví dụ: khi gọi res.render('home'), Express sẽ tìm views/home.pug.
app.set('view engine', 'pug'); // Cài đặt template engine là pug Giúp bạn viết HTML rút gọn
// End thiệt lập views

//  Thiết lập mục chứa file tĩnh của Frontend
app.use(express.static(path.join(__dirname, "public"))) // dùng Express static, bạn có thể gọi từ HTML <link rel="stylesheet" href="/css/style.css">
// End thiệt lập public

//  Thiet lap Router 

app.use(`/${variableConfig.pathAdmin}`, adminRouters)  // route dành cho admin vào đường dẫn như /admin/category
app.use("/", clientRouters) // gắn các route phía người dùng (client) vào trang chủ vd: /product

//  End Thiet lap Router


app.listen(port, `0.0.0.0`, () => {
    console.log(`Example app listening on port ${port}`)
})

//quangdoanh04072004
//D97Kh4S6XDuM5xo9
// mongodb+srv://quangdoanh04072004:D97Kh4S6XDuM5xo9@cluster0.kjsqw.mongodb.net/tour-management