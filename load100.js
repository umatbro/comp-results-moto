const load100 = require('./utils');
const User = require('./models/contestant');
const collections = require('pycollections');
const mongoose = require('mongoose');

let uri = load100.getProjectMongoUri();
// load100.generateRandomUsers(uri, 100);
// load100.assignTracks(uri, 10)
//     .then((res) => console.log(res))
//     .catch(err => console.log(err));

// load100.generateRandomTracks(uri, 30);

// load100.clearDb('mongodb://umat:qpwoei@ds261078.mlab.com:61078/comp-results-test')
// .then(t => console.log(t))
// .catch(err => console.log(err));


load100.exportData('./config/db_config.json', './');
//
// mongoose.connect(uri);
//
//
// User.find({}).exec()
//     .then((users) => {
//         let scores = new collections.DefaultDict(() => 0);
//         for (let user of users) {
//             let numOfCompletedTracks = user.completedTracks.length;
//             scores.set(numOfCompletedTracks, scores.get(numOfCompletedTracks) + 1);
//         }
//         console.log(scores);
//         mongoose.connection.close();
//     })
// .catch((err)=> console.log(err));
