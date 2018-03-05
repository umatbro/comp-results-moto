const mongoose = require('mongoose');

let trackSchema = new mongoose.Schema({
    name: String,
    points: {
        type: Number,
        get: (v) => Math.floor(v),
        set: (v) => Math.floor(v),
        required: true,
        default: 0,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
    trackStart: String,
    trackEnd: String,
    length: Number,
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;