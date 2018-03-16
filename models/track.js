const mongoose = require('mongoose');

let trackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
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

if (!trackSchema.options.toJSON) trackSchema.options.toJSON = {};
// exclude _id (it will be included as id in virtual) and __v
trackSchema.options.toJSON.hide = '_id __v';
trackSchema.options.toJSON.transform = function(doc, ret, options) {
    if (options.hide) {
        options.hide.split(' ').forEach((property) => delete ret[property]);
    }
    return ret;
};
trackSchema.options.toJSON.virtuals = true;

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
