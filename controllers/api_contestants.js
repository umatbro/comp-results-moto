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
exports.disqualifyUser = function(req, res) {
    const id = req.params.id;
    const isDisqualified = // no body or set `disqualified` explicitly in body
        (!req.body.disqualified || req.body.disqualified === 'true');

      if (isDisqualified) {
        Contestant.findByIdAndUpdate(id, {disqualified: true}).exec()
          .then((updatedContestant) => res.json(updatedContestant))
          .catch((err) => res.json(err));
      }
      // TODO handle un-disqualify
};
