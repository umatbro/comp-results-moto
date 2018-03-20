const express = require('express');
const router = express.Router();
const apiTrack = require('../controllers/api_track');
const apiContestant = require('../controllers/api_contestants');

router.post('/tracks/new', apiTrack.saveNewTrack);
router.get('/tracks', apiTrack.findTracks);
router.put('/tracks/:id/modify', apiTrack.modifyTrack);
router.delete('/tracks/:id/delete', apiTrack.deleteTrack);

router.post('/users', apiContestant.addContestant);
router.get('/users/ranking', apiContestant.userRanking);
router.get('/users/:id?', apiContestant.findContestants);
router.put('/users/:id/name', apiContestant.modifyContestantName);
router.put('/users/:id/disqualify', apiContestant.disqualifyUser);
router.delete('/users/:id/delete', apiContestant.deleteUser);
router.put('/users/:id/add-track', apiContestant.completedTrack);

module.exports = router;
