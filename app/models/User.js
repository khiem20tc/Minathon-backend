const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: Object
    }
})

module.exports = {UserEntity: mongoose.model('user', UserSchema)};