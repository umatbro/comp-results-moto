const Contestant = require('../models/contestant');
const q = require('./db-queries');
const Track = require('../models/track');

exports.findContestants = async function(req, res) {
    let contestantId = req.params.id;
    if (contestantId) {
        try {
            let contestant = await Contestant.findById(contestantId).populate('completedTracks').exec();
            if (!contestant) return res.status(404).json({message: 'User not found'});
            return res.json(contestant);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
    // if no id in query - list all (or everything that was queried
    if (!req.query.disqualified) req.query.disqualified = false;
    try {
        return res.json(!req.query.disqualified ? await q.getAllUsers() : await q.getDisqualifiedUsers());
    } catch (err) {
        return res.status(500).json(err);
    }
};

/**
 * Create new user.
 *
 * @param {Object} req Request body should contain
 * new user name under `name` key
 * @param {Object} res
 */
exports.addContestant = function(req, res) {
    Contestant.create(req.body)
        .then((contestant) => res.json(contestant))
        .catch((err) => res.status(500).json(err));
};

/**
 * Modify contestant name.
 * Usage:
 * PUT name='new name' /api/contestant/:id/name
 *
 * @param {Object} req should contain params with id and body with new name
 * @param {Object} res
 */
exports.modifyContestantName = function(req, res) {
    const id = req.params.id;
    const name = req.body.name;

    Contestant.findById(id)
        .exec()
        .then((contestant) => {
            contestant.name = name;
            contestant.save().exec()
                .then((newContestant) => res.json(newContestant))
                .catch((err) => res.json(err));
        })
        .catch((err) => res.status(500).json(err));
};

/**
 * Disqualify or un-disqualify user.
 * Usage:
 * PUT disqualified='true' /api/contestant/:id/disqualify
 *
 * @param {Object} req should contain params with id and:
      * no body (user will be disqualified)
      * 'disqualify=false' in body to set disqualified on false
 * @param {Object} res
 */
exports.disqualifyUser = async function(req, res) {
    const id = req.params.id;
    const shouldBeDisqualified = // no body or set `disqualified` explicitly in body
        (!req.body.hasOwnProperty('disqualified')
            || req.body.disqualified === true
            || req.body.disqualified === 'true'
        );

      if (shouldBeDisqualified) {
        try {
          let foundContestant = await Contestant
            .findByIdAndUpdate(id, {disqualified: true}).exec();
          return res.json(foundContestant);
        } catch (err) {
          return res.json(err);
        }
      }
      Contestant.findByIdAndUpdate(id, {disqualified: false}).exec()
        .then((foundContestant) => res.json(foundContestant))
        .catch((err) => res.status(500).json(err));
};

/**
 * Delete user from database
 * Usage:
 * DELETE /api/contestant/:id/delete
 *
 * @param {Object} req should contain params with id
 * @param {Object} res
 */
exports.deleteUser = function(req, res) {
  let id = req.params.id;
  Contestant.findByIdAndRemove(id).exec()
    .then((removedContestant) => res.json(removedContestant))
    .catch((err) => res.status(500).json(err));
};

/**
 * Add completed track to user
 * Usage:
 * PUT /api/contestant/:id/add-track
 *
 * @param {Object} req should contain params with user id and added track id
 * @param {Object} res
 */
exports.completedTrack = async function(req, res) {
    let userId = req.params.id;
    let trackId = req.body.id;

    let contestant;
    try {
        contestant = await Contestant.findById(userId);
        if (!contestant) return res.status(404).json({message: 'Not found'})
    } catch (err) {
        throw res.status(500).json(err);
    }
    let track;
    try {
        track = await Track.findById(trackId).exec();
    } catch (err) {
        throw res.status(404).json(err);
    }
    contestant.completedTracks.push(track._id);
    try {
        return res.json(await contestant.save());
    } catch (err) {
        throw res.status(500).json(err);
    }
};

exports.removeCompletedTrack = function(req, res) {
    q.deleteTrackFromUser(req.params.id, req.body.id)
        .then((updatedUser) => res.json(updatedUser))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err)
        });
};

/**
 * Get full ranking of all contestants
 * Usage:
 * GET /api/users/ranking
 *
 * @param {Object} req should contain params with user id and added track id
 * @param {Object} res
 */
exports.userRanking = function(req, res) {
    q.getRanking()
        .then((ranking) => res.json(ranking))
        .catch((err) => res.status(500).json(err));
};
