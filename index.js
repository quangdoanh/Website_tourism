const express = require('express')
const path = require('path')
const app = express()
const port = 3000


// Thiết lập views
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('clients/pages/home.pug', {
        pageTitle: "Doanh dep zai so 1"
    })
})
app.get('/tours', (req, res) => {
    res.render('clients/pages/tour-list', {
        pageTitle: "Doanh dep zai"
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})