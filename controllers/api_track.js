const Track = require('../models/track');
const PAGE_SIZE = 1000;

exports.saveNewTrack = function(req, res) {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send({message: 'New track cannot be empty'});
    }
    Track.create(req.body, (err, track) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: `Error while creating new track: ${err}`,
            });
        }
        res.status(200).json(track);
    });
};

exports.findTracks = function(req, res) {
    let query = req.query;
    let page = parseInt(req.query.page);
    delete query.page;
    page = page ? page : 1;

    // check if query is an empty object
    if (!query) {
        Track
            .find({})
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .exec()
            .then((tracks) => {
                res.json({page, tracks});
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    } else {
        let q = {};
        if (query.name) q.name = query.name;
        if (query.id) q.id = query.id;
        if (query.length) q.length = query.length;
        Track.find(q).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).exec()
            .then((tracks) => {
                res.json({page, tracks});
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    }
};

exports.modifyTrack = function(req, res) {
    let id = req.params.id;
    let newValues = req.body;

    Track.findById(id, (err, track) => {
        if (err) return res.json(err);
        track.set(newValues);
        track.save()
            .then((newTrack) => res.json(newTrack))
            .catch((err) => res.status(500).json(err));
    });
};

exports.deleteTrack = function(req, res) {
    let id = req.params.id;
    Track
        .findById(id)
        .remove()
        .exec()
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(500).json(err));
};
