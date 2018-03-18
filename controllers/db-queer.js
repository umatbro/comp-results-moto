const Contestant = require('../models/contestant');
const Track = require('../models/track');


module.exports =
{
    getTrackNames: function(cb) {
        return Track.aggregate([
            {'$project': {name: 1, _id: 0}},
        ]).exec(cb);
    },

    getRanking: function() {
        return null;
    },
};
