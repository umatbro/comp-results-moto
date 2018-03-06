const Track = require('../models/track');

exports.saveNewTrack = function(req, res) {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send({message: 'New track cannot be empty'});
    }
    Track.create(req.body, (err, track) => {
        if (err) {
            console.log(err);
            res.status(500).send({message: 'Error while creating new track'});
        }
        res.status(200).send(track);
    });
};