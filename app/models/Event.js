const mongoose = require('mongoose');

const participant = mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: "User", require: true},
    isAccepted: {type: Boolean, default: false}
}, {_id: false})

const EventSchema = mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: Number,
        required: true
    },
    max: {
        type: Number,
        required: true
    },
    host: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    keywords: {
        type: String,
        required: true
    },
    participant_subschema: [{type: participant}],
    status: {
        type: Boolean,
        default: false
    }
})

module.exports = {
    EventEntity: mongoose.model('event', EventSchema),
    participant: mongoose.model('participant', participant)
};