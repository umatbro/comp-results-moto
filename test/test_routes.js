const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');
const app = require('../app');

// models
const Track = require('../models/track');
const Contestant = require('../models/contestant');


describe('Routing', () => {
  before((done) => { // run test server
    this.app = app;
    let port = Math.floor(Math.random() * 9000) + 1000;
    this.server = this.app.listen(port, () => done());
  });

  after(() => {
    this.server.close();
  });

  describe('Rendering', () => {
    beforeEach(() => {
      this.spy = sinon.spy(this.app, 'render');
    });

    afterEach( () => this.spy.restore() );

    it(' \'/\' should render index template', (done) => {
      request(this.app).get('/').expect(200).end((err, res) => {
        let templateName = this.spy.getCall(0).args[0];
        expect(templateName).to.equal('index');
        done();
      });
    });

    it('\'/admin\' sould render admin template', (done) => {
      request(this.app)
        .get('/admin')
        .expect(200)
        .end((err, res) => {
          let templateName = this.spy.getCall(0).args[0];

          expect(templateName).to.equal('admin/index');
          done();
      });
    });
  });

  describe('CRUD operations  (/api routes)', () => {
      beforeEach(() => {
        sinon.stub(Track, 'find');
        sinon.stub(Track, 'create');
        sinon.stub(Track.prototype, 'save');
      });

      afterEach(() => {
        Track.find.restore();
        Track.create.restore();
        Track.prototype.save.restore();
      });

      describe('Track routes', () => {
        it('should return all tracks if get query is empty', (done) => {
          request(this.app).get('/api/tracks').expect(200).end((err, res) => {
            sinon.assert.calledWith(Track.find, {});
            done();
          });
        });
        it('should query for track of given name', (done) => {
            request(this.app)
                .get('/api/tracks')
                .query({name: 'Test track'})
                .expect(200)
                .end((err, res) => {
                    sinon.assert.calledWith(Track.find, {name: 'Test track'});
                    done();
                });
        });
        // TODO add handlers for track length and point score

        it('should store new Track in database', (done) => {
            let newTrack = {name: 'new track', points: 30, length: 1.25};
            request(this.app)
                .post('/api/tracks')
                .send(newTrack)
                .expect(200)
                .end((err, res) => {
                    sinon.assert.calledWith(Track.create, newTrack);
                    done();
                });
        });
        it('should update Track based on its name', (done) => {
            // TODO
            done(new Error('TODO'));
        });
      });

      describe('Contestant routes', () => {

      });
  });
});
