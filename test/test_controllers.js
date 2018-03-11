const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const mongoose = require('mongoose');


const Track = require('../models/track');

const apiTrack = require('../controllers/api_track');

describe('Track controller', () => {
    beforeEach(() => {
        sinon.stub(Track, 'create');
        let findStub = sinon.stub(Track, 'find');
        findStub.returns(new mongoose.Query());
        Track.prototype.find = sinon.spy();

        this.req = httpMocks.createRequest();
        this.res = httpMocks.createResponse();
    });
    afterEach(() => {
        Track.create.restore();
        Track.find.restore();
    });

    it('should create new db entry and return success response', (done) => {
        let trackParams = {name: 'track', length: 10, points: 10};
        let request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/tracks',
            body: trackParams,
        });

        apiTrack.saveNewTrack(request, this.response);

        sinon.assert.calledWith(Track.create, trackParams);
        done();
    });

    it('should search for all tracks when no query provided', (done) => {
        let query = {};
        apiTrack.findTracks(this.req, this.res);
        sinon.assert.calledWith(Track.find, query);
        done();
    });

    it('should query only desired fields ' +
        '(even if redundant fields were provided)', (done) => {
        this.req.query = {name: 'Name', stuff: 'some stuff'};
        // 'stuff' field is redundant, we don't want to query it

        apiTrack.findTracks(this.req, this.res);
        sinon.assert.calledWith(Track.find, {name: 'Name'});
        done();
    });
});


// TODO 1: 'should update track based on its name
