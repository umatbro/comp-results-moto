const express = require('express');
const router = express.Router();
const Track = require('../models/track');
const apiTrack = require('../controllers/api_track');

router.post('/tracks', apiTrack.saveNewTrack);
router.get('/tracks', apiTrack.findTracks);

module.exports = router;