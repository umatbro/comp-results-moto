const express = require('express');
const router = express.Router();
const Track = require('../models/track');
const apiTrack = require('../controllers/api_track');
const apiContestant = require('../controllers/api_contestants');

router.post('/tracks/new', apiTrack.saveNewTrack);
router.get('/tracks', apiTrack.findTracks);
router.put('/tracks/:id/modify', apiTrack.modifyTrack);
router.delete('/tracks/:id/delete', apiTrack.deleteTrack);

router.post('/user/new', apiContestant.addContestant);
router.get('/users', apiContestant.findContestants);
router.put('/user/:id/name', apiContestant.modifyContestantName);
router.put('/user/:id/disqualify', apiContestant.disqualifyUser);
router.delete('/user/:id/delete', apiContestant.deleteUser)

module.exports = router;
