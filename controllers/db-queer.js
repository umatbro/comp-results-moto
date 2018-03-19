const Contestant = require('../models/contestant');
const Track = require('../models/track');

function getTrackNames(cb) {
  return Track.aggregate([
      {'$project': {name: 1, _id: 0}},
  ]).exec(cb);
}

function getRanking() {
  return null;
}


module.exports = {
    getTrackNames,
    getRanking,
};
