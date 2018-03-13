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
    Contestant.find(req.query)
        .exec()
        .then((contestants) => res.json(contestants))
        .catch((err) => res.json(err));
};

/**
 * Create new user.
 *
 * @param req Request body should contain new user name under `name` key
 * @param res
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
