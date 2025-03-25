const express = require('express')
const path = require('path')
require('dotenv').config()

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

// Controllers
const tourController = require("./controllers/client/tour.controller")
const homeController = require("./controllers/client/home.controller")
// end Controllers
const app = express()
const port = 3000


// Thiết lập views
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

//  Thiết lập mục chứa file tĩnh của Frontend
app.use(express.static(path.join(__dirname, "public")))

app.get('/', homeController.home)
app.get('/tours', tourController.list)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//quangdoanh04072004
//D97Kh4S6XDuM5xo9
// mongodb+srv://quangdoanh04072004:D97Kh4S6XDuM5xo9@cluster0.kjsqw.mongodb.net/tour-management