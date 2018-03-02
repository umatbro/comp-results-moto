const mongoose = require('mongoose');

let contestantSchema = new mongoose.Schema({
    name: String,
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

contestantSchema.virtual('score').get(() => {
    let score = 0;
    for (let track of this.completedTracks) {
        score += track.points;
    }
    return score;
});

const Contestant = mongoose.model('Contestant', contestantSchema);

module.exports = Contestant;
