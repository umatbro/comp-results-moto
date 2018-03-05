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
    // this.populate();
    return this.completedTracks.reduce((acc, x) => acc + x.points, 0);
});

const Contestant = mongoose.model('Contestant', contestantSchema);

module.exports = Contestant;
