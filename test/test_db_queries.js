const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;
const mongoose = require('mongoose');

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
});
