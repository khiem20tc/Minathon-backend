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
    },
    phoneNumber: {
        type: String
    },
    aboutMe: {
        type: String
    }
})

module.exports = {UserEntity: mongoose.model('user', UserSchema)};