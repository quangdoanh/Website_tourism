const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    status: String
});

const accountAdmin = mongoose.model('accountAdmin', schema, 'account-admin')

module.exports = accountAdmin