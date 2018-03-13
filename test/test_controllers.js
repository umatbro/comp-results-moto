const expect = require('chai').expect;
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const mongoose = require('mongoose');
const utils = require('../utils');


const Track = require('../models/track');
const Contestant = require('../models/contestant');

const apiTrack = require('../controllers/api_track');
const apiContestant = require('../controllers/api_contestants');

describe('Track controllers', () => {
    beforeEach(() => {
        sinon.stub(Track, 'create');
        sinon.stub(Track.prototype, 'save');
        let findStub = sinon.stub(Track, 'find');
        findStub.returns(new mongoose.Query());
        Track.prototype.find = sinon.spy();

        [this.res, this.req] = utils.httpMocks();
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

describe('Contestant controllers', () => {
    beforeEach(() => {
        [this.res, this.req] = utils.httpMocks();
        this.execStub = sinon.stub(mongoose.Query.prototype, 'exec');

        sinon.spy(Contestant, 'findById');
        sinon.spy(Contestant, 'find');
    });

    afterEach(() => {
        mongoose.Query.prototype.exec.restore();

        Contestant.find.restore();
        Contestant.findById.restore();
    });

    it('should list all users if no id in query', (done) => {
        let queryResult = [{user1: 'user 1'}, {user2: 'user 2'}];
        this.execStub.resolves(queryResult);

        apiContestant.findContestants(this.req, this.res);
        sinon.assert.calledWith(Contestant.find, {});

        // TODO
        // sinon.spy(this.res, 'json');
        // sinon.assert.calledWith(this.res.json, queryResult);
        // this.res.json.restore();
        done();
    });

    it('should query user of given id', (done) => {
        this.execStub.resolves({user: 'user 1'});
        this.req.query = {id: '123'};

        apiContestant.findContestants(this.req, this.res);
        sinon.assert.calledWith(Contestant.findById, '123');
        done();
    });

    it('should query for creating new user', (done) => {
        let newContestantSettings = {
            name: 'new name',
        };
        let newContestant = new Contestant(newContestantSettings);
        this.req.body = newContestantSettings;

        sinon.stub(Contestant, 'create').resolves(newContestant);
        apiContestant.addContestant(this.req, this.res);

        sinon.assert.calledWith(Contestant.create, newContestantSettings);
        done();
    });

    it('should modify user name', async () => {
        let name = 'new name';
        this.req.body.name = name;
        let id = '123';
        this.req.params.id = id;
        let contestant = new Contestant({name: 'old name'});
        let newContestant = new Contestant({name: name});

        this.execStub.resolves(contestant);

        sinon.stub(contestant, 'save').resolves(newContestant);

        await apiContestant.modifyContestantName(this.req, this.res);

        expect(Contestant.findById.calledWith(id)).to.be.true;
        expect(contestant.save.calledOnce).to.be.true;
    });
});
