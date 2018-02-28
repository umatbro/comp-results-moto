const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');
const express = require('express');
const app = require('../app');


describe('Routing', () => {
  before(done => {  // run test server
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

    it(' \'/\' should render index template', done => {
      request(this.app).get('/').expect(200).end((err, res) => {
        let [view, locals, callback] = this.spy.getCall(0).args;
        expect(view).to.equal('index');
        done();
      });
    });

    it('\'/admin\' sould render admin template', done => {
      request(this.app)
        .get('/admin')
        .expect(200)
        .end((err, res) => {
          let templateName = this.spy.getCall(0).args[0];

          expect(templateName).to.equal('admin');
          done();
      });
    });
  });
});
