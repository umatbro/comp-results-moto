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
