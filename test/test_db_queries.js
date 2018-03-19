const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const Contestant = require('../models/contestant');
const q = require('../controllers/db-queer');

describe('Database queries', () => {
    before(() => {
        let {name, host, port, user, password} = JSON.parse(fs.readFileSync(
            path.join(__dirname, 'test_resources', 'test_db_config.json'),
            'utf-8')
        );
        let dbUri = `mongodb://${user}:${password}@${host}:${port}/${name}`;
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
        {"id":ObjectID("5aaee166ce191527cc668f82"),"name":"Asta Larsen","score":208,"completedTracks":[ObjectID("5aaed9482ab3da209c4e6adb"),ObjectID("5aaed9482ab3da209c4e6ada"),ObjectID("5aaed9482ab3da209c4e6add")]},
        {"id":ObjectID("5aaee166ce191527cc668f83"),"name":"Quinn Johnson","score":132,"completedTracks":[ObjectID("5aaed9482ab3da209c4e6ad9"),ObjectID("5aaed9482ab3da209c4e6add")]},
        {"id":ObjectID("5aaee166ce191527cc668f84"),"name":"Ben Holt","score":40,"completedTracks":[ObjectID("5aaed9482ab3da209c4e6ada")]},
        {"id":ObjectID("5aaee166ce191527cc668f85"),"name":"Vincent Gill","score":0,"completedTracks":[]},
      ];

      let allUsers = q.getAllUsers()
        .then((contestants) => {
          expect(contestants).to.have.deep.members(expectedContestants);
          done();
        })
        .catch((err) => done(err));
    });
});
