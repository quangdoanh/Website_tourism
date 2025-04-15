const express = require('express')
const path = require('path')

// tải các biến môi trường từ file .env vào biến môi trường của Node.js
require('dotenv').config()

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
global.adminPathName = variableConfig.pathAdmin
// end

// Cho phép gửi file json lên be
app.use(express.json());
// End

// Routers
const adminRouters = require("./routers/admin/index.router")
const clientRouters = require("./routers/client/index.router")
// End Routers


// Thiết lập views
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');
// End thiệt lập views

//  Thiết lập mục chứa file tĩnh của Frontend
app.use(express.static(path.join(__dirname, "public")))
// End thiệt lập public

//  Thiet lap Router 

app.use(`/${variableConfig.pathAdmin}`, adminRouters)
app.use("/", clientRouters)

//  End Thiet lap Router


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//quangdoanh04072004
//D97Kh4S6XDuM5xo9
// mongodb+srv://quangdoanh04072004:D97Kh4S6XDuM5xo9@cluster0.kjsqw.mongodb.net/tour-management