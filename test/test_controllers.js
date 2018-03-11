const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const mongoose = require('mongoose');


const Track = require('../models/track');

const apiTrack = require('../controllers/api_track');

describe('Track controllers', () => {
    beforeEach(() => {
        sinon.stub(Track, 'create');
        sinon.stub(Track.prototype, 'save');
        let findStub = sinon.stub(Track, 'find');
        findStub.returns(new mongoose.Query());
        Track.prototype.find = sinon.spy();

        this.req = httpMocks.createRequest();
        this.res = httpMocks.createResponse();
    });
    afterEach(() => {
        Track.create.restore();
        Track.find.restore();
        Track.prototype.save.restore();
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

    it('should update name', (done) => {
        let fakeId = '111aa';
        let newData = {name: 'new name'};
        this.req.body = newData;
        this.req.params = {id: fakeId};

        let stub = sinon.stub(Track, 'findById');
        let track = new Track();
        stub.yields([null, track]);
        let setSpy = sinon.spy(mongoose.Document.prototype, 'set');

        apiTrack.modifyTrack(this.req, this.res);

        sinon.assert.calledWith(Track.findById, fakeId);
        done();
        // TODO ??
        sinon.assert.calledWith(setSpy, newData);
    });
    it('should update length and points');
    it('should throw an error if name is not string');

    it('should delete queried track');
});


// TODO 1: 'should update track based on its name
