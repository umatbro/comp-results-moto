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
        sinon.stub(Track, 'findOne');
        sinon.stub(Track, 'create');
      });

      afterEach(() => {
        Track.find.restore();
        Track.findOne.restore();
        Track.create.restore();
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
                    sinon.assert
                        .calledWith(Track.find, {name: 'Test track'});
                    done();
                });
        });

          it('should store new Track in database', (done) => {
              let newTrack = {name: 'new track', points: 30, length: 1.25};
              Track.create.yields(null, new Track(newTrack));

              request(this.app)
                  .post('/api/tracks/new')
                  .send(newTrack)
                  .expect(200)
                  .end((err, res) => {
                      sinon.assert.calledWith(Track.create, newTrack);
                      done();
                  });
          });
        // TODO add handlers for track length and point score
      });

      describe('Contestant routes', () => {

      });
  });
});
