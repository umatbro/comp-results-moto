const Contestant = require('../models/contestant');
const Track = require('../models/track');

function getTrackNames(callback) {
  return Track.aggregate([
      {'$project': {name: 1, _id: 0}},
  ]).exec(callback);
}

function getRanking(callback) {
  return Contestant.aggregate([
      {
          $match: {disqualified: false}
      },
      {
          $lookup: {
              from: 'tracks',
              localField: 'completedTracks',
              foreignField: '_id',
              as: 'tracks',
          }
      },
      {
          $addFields: {
              id: '$_id',
              score: {$sum: '$tracks.points'}
          }
      },
      {
          $sort: {score: -1}
      },
      {
          $project: {
              tracks: 0,
              _id: 0,
              __v: 0,
              disqualified: 0,
              completedTracks: 0,
          }
      }
  ]).exec(callback);
}

async function getAllUsers(callback) {
  return Contestant.aggregate([
    {'$match': {disqualified: false}},
    {'$lookup': {
      'from': 'tracks', // name of foreign collection
      'localField': 'completedTracks',
      'foreignField': '_id',
      'as': 'tracks'
    }},
    {
      '$addFields': {
        'id': '$_id',
        'score': {'$sum': '$tracks.points'}
      }
    },
    {'$project': {tracks: 0, _id: 0, __v: 0, disqualified: 0}}
  ]).exec(callback);
}


module.exports = {
    getTrackNames,
    getRanking,
    getAllUsers,
};
