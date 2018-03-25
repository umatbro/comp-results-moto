const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const fetch = require('node-fetch');

const Track = require('./models/track');
const Contestant = require('./models/contestant');
const projSettings = require('./settings');

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
            let tracksAssigned = gaussianRandom(-2, maxTracksAssigned);
            tracksAssigned = tracksAssigned > 0 ? tracksAssigned : 0;
            let query = Track.aggregate([
                {'$sample': {size: tracksAssigned}},
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

async function clearDb(dbUri) {
    mongoose.connect(dbUri);
    await Track.remove({}).exec();
    await Contestant.remove({}).exec();

    mongoose.connection.close();
    return true;
}

/**
 * Dump data from database.
 *
 * @param cfgFile contains info like db host, username, etc.
 * @param outDir output dir, 2 output files in json format
 */
function dumpData(cfgFile, outDir) {
    let {host, port, name, user, password} = JSON.parse(fs.readFileSync(cfgFile));
    console.log('Run commands: ');
    console.log(`mongoexport --host ${host}:${port} --username ${user} --password ${password} --db ${name} --collection contestants --type=json --out ${outDir}/contestants.json`);
    console.log(`mongoexport --host ${host}:${port} --username ${user} --password ${password} --db ${name} --collection tracks --type=json --out ${outDir}/tracks.json`);
}

function exportData(cfgFile, dir) {
    let {host, port, name, user, password} = JSON.parse(fs.readFileSync(cfgFile));
    let uri = `mongodb://${user}:${password}@${host}:${port}/${name}`;
    console.log(`mongoimport --uri ${uri} --file ${dir}/contestants.json --collection contestants`);
    console.log(`mongoimport --uri ${uri} --file ${dir}/tracks.json --collection tracks`);
}

/**
 * Credits: https://stackoverflow.com/a/39187274/7301831
 * @param start of range
 * @param end of a range
 * @returns {number} random number in normal distribution
 */
function gaussianRandom(start, end) {
    function gaussianRand() {
        let rand = 0;

        for (let i = 0; i < 6; i += 1) {
            rand += Math.random();
        }

        return rand / 6;
    }

    return Math.floor(start + gaussianRand() * (end - start + 1));
}

/**
 * Construct uri for connections with db in following format:
 * mongodb://<dbuser>:<dbpassword>@<dbhost>:<port>/<dbname>
 *
 * @param settings
 */
function constructMongoUri(settings) {
    // helper function
    function checkProp(propertyName) { // check if property is in object, else throw error
        if (!settings[propertyName]) {
            throw new Error(`No ${propertyName} found in settings (field required`)
        }
        return settings[propertyName];
    }
    let user = checkProp('user');
    let password = checkProp('password');
    let host = checkProp('host');
    let port = settings.port || 27017;
    let dbName = checkProp('name');

    return `mongodb://${user}:${password}@${host}:${port}/${dbName}`;
}

/**
 * Get project's mongo URI. 
 * First, check if LOCAL_DB eniromental variable is set to '1'.
 * Then try to search for config file, if found, use configuration
 * stored in that file.
 * 
 * @return database URI as a string (example: mongodb://localhost/comp-results)
 */
function getProjectMongoUri() {
    let env = process.env;
    let shouldDbBeLocal = env.hasOwnProperty('LOCAL_DB') && env.LOCAL_DB === '1' ? true : false;
    let cfgFilePath = path.join(projSettings.CONFIG_DIR, 'db_config.json');
    if (!fs.existsSync(cfgFilePath) || shouldDbBeLocal) {
        return `mongodb://localhost/${projSettings.PROJECT_NAME}`;
    }
    let settings = JSON.parse(fs.readFileSync(cfgFilePath));
    return constructMongoUri(settings);
}

module.exports = {
    generateRandomUsers: loadRandomUsers,
    generateRandomTracks,
    assignTracks: randomlyAssignCompletedTracks,
    clearDb,
    dumpData,
    exportData,
    constructMongoUri,
    getProjectMongoUri,
};

if (!module.parent) {
  let args = parser.parseArgs();
  console.log(args);
}
