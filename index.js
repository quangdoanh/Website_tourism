const express = require('express')
const path = require('path')

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://quangdoanh04072004:D97Kh4S6XDuM5xo9@cluster0.kjsqw.mongodb.net/tour-management');

const Tour = mongoose.model('Tour', {
    name: String,
    vehicle: String
});

const app = express()
const port = 3000


// Thiết lập views
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

//  Thiết lập mục chứa file tĩnh của Frontend
app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {

    res.render('clients/pages/home.pug', {
        pageTitle: "Doanh dep zai so 1"
    })
})
app.get('/tours', async (req, res) => {
    const tourList = await (Tour.find({}));

    console.log(tourList);

    res.render('clients/pages/tour-list', {
        pageTitle: "Doanh dep zai",
        tourList: tourList
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//quangdoanh04072004
//D97Kh4S6XDuM5xo9
// mongodb+srv://quangdoanh04072004:D97Kh4S6XDuM5xo9@cluster0.kjsqw.mongodb.net/tour-management