const express = require('express');
const router = express.Router();
const Track = require('../models/track');
const apiTrack = require('../controllers/api_track');

router.post('/tracks/new', apiTrack.saveNewTrack);
router.get('/tracks', apiTrack.findTracks);
router.put('/tracks/:id/modify', apiTrack.modifyTrack);
router.delete('/tracks/:id/delete', apiTrack.deleteTrack);

module.exports = router;
