const mongoose = require('mongoose');
const ArgumentParser = require('argparse').ArgumentParser;
const fetch = require('node-fetch');

const Track = require('./models/track');
const Contestant = require('./models/contestant');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

function loadRandomUsers(dbURI, numOfUsers=100) {
    mongoose.connect(dbURI);
    fetch('https://randomuser.me/api/?results=' + numOfUsers)
        .then((res) => res.json())
        .then((response) => Promise.all(
            response.results.map((user) => {
                let name = user.name;
                return Contestant.create({
                    name: name.first.capitalize() +' '+ name.last.capitalize(),
                });
            })
        ))
        .then((res) => console.log('Number of records:', res.length))
        .catch((err) => console.log(err))
        .then(() => mongoose.connection.close());
}

/**
 * Get point score for a track based on its length
 * and random difficulty factor.
 *
 * @param {Number} length
 * @return {number} point score
 */
function lengthToPoints(length) {
    // difficulty: random range 0.5 - 1.5
    let difficultyFactor = Math.random() + 0.5;
    return ~~(length * difficultyFactor * 0.01);
}

function generateRandomTracks(dbURI, numOfTracks=30) {
    mongoose.connect(dbURI);
    fetch('https://randomuser.me/api/?results=' + numOfTracks)
        .then((res) => res.json())
        .then((response) => Promise.all(
            response.results.map((track) => {
                let location = track.location;
                // lengths from 500 - 10 000 m
                let trackLength = Math.floor(Math.random() * 9500 + 500);
                return Track.create({
                    name: location.city.capitalize(),
                    length: trackLength,
                    points: lengthToPoints(trackLength),
                });
            })
        ))
        .then((res) => console.log('Number of records:', res.length))
        .catch((err) => console.log(err))
        .then(() => mongoose.connection.close());
}

/**
 * Assign random number of tracks completed to each Contestant.
 *
 * @param dbURI
 * @param maxTracksAssigned - up to this many new tracks will be assigned
 * @returns {Promise<*>} array containing updated documents.
 */
async function randomlyAssignCompletedTracks(dbURI, maxTracksAssigned=10) {
    ++maxTracksAssigned;
    mongoose.connect(dbURI);
    let allUsers;
    try {
        allUsers = await Contestant.find({disqualified: false}).exec();
    } catch (err) {
        throw err;
    }
    let updatedDocs;
    try {
        updatedDocs = await Promise.all(allUsers.map(async (user) => {
            let query = Track.aggregate([
                {'$sample': {size: Math.floor(Math.random() * maxTracksAssigned)}},
                {'$project': {'_id': 0, 'id': '$_id'}}
            ]);
            let tracksIds;
            try {
                tracksIds = await query.exec();
            } catch (err) {
                throw err;
            }
            tracksIds.forEach((track) => {
                user.completedTracks.push(track.id);
            });
            return await user.save();
        }));
    } catch (err) {
        throw(err);
    } finally {
        mongoose.connection.close();
    }

    return updatedDocs;
}

module.exports = {
    generateRandomUsers: loadRandomUsers,
    generateRandomTracks: generateRandomTracks,
    assignTracks: randomlyAssignCompletedTracks,
};

if (!module.parent) {
  let args = parser.parseArgs();
  console.log(args);
}
