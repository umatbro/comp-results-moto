const mongoose = require('mongoose');

let contestantSchema = new mongoose.Schema({
    name: {type: String, required: true},
    disqualified: {
        type: Boolean,
        default: false,
        required: true,
    },
    completedTracks: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Track',
    }],
    totalPoints: {
        type: Number,
        min: 0,
    },
});

contestantSchema.virtual('score').get(function() {
    return this.completedTracks.reduce((acc, doc) => acc + doc.points, 0);
});

if (!contestantSchema.options.toJSON) contestantSchema.options.toJSON = {};
contestantSchema.options.toJSON.virtuals = true;

contestantSchema.options.toJSON.__hide = '_id __v';
contestantSchema.options.toJSON.transform = function(doc, ret, options) {
    if (options.hide) {
        options.hide.split(' ').forEach((property) => delete ret[property]);
    }
    if (options.__hide) {
        options.__hide.split(' ').forEach((property) => delete ret[property]);
    }
    return ret;
};

const Contestant = mongoose.model('Contestant', contestantSchema);

module.exports = Contestant;
