const Contestant = require('../models/contestant');

exports.findContestants = function(req, res) {
    let contestantId = req.query.id;
    if (contestantId) {
        Contestant
            .findById(contestantId).exec()
            .then((contestant) => res.json(contestant))
            .catch((err) => res.json(err));
    }
    // if no id in query - list all (or everything that was queried
    if (!req.query.disqualified) req.query.disqualified = false;
    Contestant.find(req.query)
        .exec()
        .then((contestants) => res.json(contestants))
        .catch((err) => res.json(err));
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
        .catch((err) => res.json(err));
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
            contestant.save()
                .then((newContestant) => res.json(newContestant))
                .catch((err) => res.json(err));
        })
        .catch((err) => res.json(err));
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
        (!req.body.disqualified || req.body.disqualified === 'true');

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
        .catch((err) => res.json(err));
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
    .catch((err) => res.json(err));
};

/**
 * Add completed track to user
 * Usage:
 * PUT /api/contestant/:id/add-track/:track_id
 *
 * @param {Object} req should contain params with user id and added track id
 * @param {Object} res
 */
exports.completedTrack = function(req, res) {

}

exports.removeCompletedTrack = function(req, res) {

}
