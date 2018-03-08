const Track = require('../models/track');

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
    let name = req.query.name;
    if (!name) {
        Track.find({}).exec((err, tracks) => {
            console.log(tracks);
            res.send(tracks);
        });
    }
    Track.findOne({name: name}).exec((err, track) => {
        if (err) res.send(`got error: ${err}`);
        if (!track) res.status(404).json({message: 'No track with given name'});
        else res.send(track);
    });
};
