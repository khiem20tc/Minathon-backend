const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    birthday: {
        type: String
    },
    gender: {
        type: Boolean
    },
    adrress: {
        type: String
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: String
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: Object
    },
    aboutMe: {
        type: String
    },
    myEvent: {
        type: Array
    }
})

module.exports = {UserEntity: mongoose.model('user', UserSchema)};