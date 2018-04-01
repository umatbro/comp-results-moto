const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const Contestant = require('../models/contestant');
const q = require('../controllers/db-queries');
const settings = require('../settings');
const utils = require('../utils');

describe('Database queries', () => {
    before(() => {
        let dbUri = utils.constructMongoUri(JSON.parse(fs.readFileSync(
            path.join(settings.CONFIG_DIR, 'test_db_config.json'), 'utf-8')
        ));
        mongoose.connect(dbUri);
    });

    after(() => {
        mongoose.connection.close();
    });

    it('should execute query displaying only track names', (done) => {
        let expectedTracks = [
            {name: 'Wakefield'},
            {name: 'Ooststellingwerf'},
            {name: 'Mackay'},
            {name: 'Albany'},
            {name: 'Neuburg-schrobenhausen'},
        ];
        q.getTrackNames()
            .then((result) => {
                expect(result).to.deep.equal(expectedTracks);
                done();
            })
            .catch((err) => done(err));
    });

    it('should list all contestants (skipping disqualified)', (done) => {
      let expectedContestants = [
        {'id': ObjectID('5aaee166ce191527cc668f82'), 'name': 'Asta Larsen', 'score': 208, 'completedTracks': [ObjectID('5aaed9482ab3da209c4e6adb'), ObjectID('5aaed9482ab3da209c4e6ada'), ObjectID('5aaed9482ab3da209c4e6add')]},
        {'id': ObjectID('5aaee166ce191527cc668f83'), 'name': 'Quinn Johnson', 'score': 132, 'completedTracks': [ObjectID('5aaed9482ab3da209c4e6ad9'), ObjectID('5aaed9482ab3da209c4e6add')]},
        {'id': ObjectID('5aaee166ce191527cc668f84'), 'name': 'Ben Holt', 'score': 40, 'completedTracks': [ObjectID('5aaed9482ab3da209c4e6ada')]},
        {'id': ObjectID('5aaee166ce191527cc668f85'), 'name': 'Vincent Gill', 'score': 0, 'completedTracks': []},
      ];

      let allUsers = q.getAllUsers()
        .then((contestants) => {
          expect(contestants).to.have.deep.members(expectedContestants);
          done();
        })
        .catch((err) => done(err));
    });

    it('should return ranking (sorted array with name, id and score)', (done) => {
      let expectedRanking = [
        {'id': ObjectID('5aaee166ce191527cc668f82'), 'name': 'Asta Larsen', 'score': 208},
        {'id': ObjectID('5aaee166ce191527cc668f83'), 'name': 'Quinn Johnson', 'score': 132},
        {'id': ObjectID('5aaee166ce191527cc668f84'), 'name': 'Ben Holt', 'score': 40},
        {'id': ObjectID('5aaee166ce191527cc668f85'), 'name': 'Vincent Gill', 'score': 0},
      ];

      q.getRanking()
        .then((ranking) => {
          expect(ranking).to.deep.equal(expectedRanking);
          done();
        })
        .catch((err) => done(err));
    });

    it('should get single user details', (done) => {
        let queriedId = '5aaee166ce191527cc668f84';
        let expectedUser = {
            id: ObjectID('5aaee166ce191527cc668f84'),
            name: 'Ben Holt',
            disqualified: false,
            completedTracks: [
                {
                    _id: ObjectID('5aaed9482ab3da209c4e6ada'),
                    name: 'Ooststellingwerf',
                    length: 3290,
                    points: 40,
                },
            ],
            score: 40,
        };

        q.getSingleUserDetails(queriedId)
            .then((user) => {
                expect(user).to.deep.equal(expectedUser);
                done();
            })
            .catch((err) => done(err));
    });

    it('should throw an error when wrong id given', (done) => {
        let badId = '123';
        q.getSingleUserDetails(badId)
            .then((cause) => done(`I should've not reached here. ${cause}`))
            .catch((err) => done());
    });

    it('should return list of disqualified users', (done) => {
        let expectedUsers = [
            {
                'id': ObjectID('5aaee166ce191527cc668f86'),
                'name': 'Jane Ortiz',
                'disqualified': true,
                'completedTracks': [
                    ObjectID('5aaed9482ab3da209c4e6add'),
                    ObjectID('5aaed9482ab3da209c4e6adb'),
                    ObjectID('5aaed9482ab3da209c4e6ad9'),
                ],
                'score': 209,
            },
        ];
        q.getDisqualifiedUsers()
            .then((users) => {
                expect(users).to.have.deep.members(expectedUsers);
                done();
            }).catch((err) => done(err));
    });
});
