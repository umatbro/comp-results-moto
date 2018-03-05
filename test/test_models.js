const expect = require('chai').expect;

const Contestant = require('../models/contestant');
const Track = require('../models/track');


describe('Contestant model', () => {
    it('should be invalid if "name" is empty', (done) => {
        let contestant = new Contestant();
        contestant.validate((err) => {
            expect(err.errors.name).to.exist;
            done();
        });
    });
    it('should be valid if  "name" is not empty', (done) => {
        let c = new Contestant({name: 'Test name'});
        c.validate((err) => {
            if (!err) done();
            expect(err.errors.name).to.not.exist;
            done();
        });
    });

    it('should not be disqualified by default', (done) => {
        let c = new Contestant();
        c.validate((err) => {
            expect(c.disqualified).to.be.false;
            done();
        });
    });

    describe('score getter', () => {
        it('should sum total number of points', (done) => {
            let tracks = [
                new Track({points: 10}),
                new Track({points: 20}),
                new Track({points: 30}),
                new Track({points: 10}),
            ];
            let contestant = new Contestant({
                name: 'Test contestant', completedTracks: tracks,
            });

            expect(contestant.score).to.equal(70);
            done();
        });

        it('should return 0 if competitor has no tracks completed', (done) => {
            let tracks = [];
            let contestant = new Contestant({
                name: 'test', completedTracks: tracks,
            });

            expect(contestant.score).to.equal(0);
            done();
        });
    });
});


describe('Track model', () => {
    it('should floor float point numbers to integers', (done) => {
        let track1 = new Track({points: 1.01});
        let track2 = new Track({points: 1.99});
        expect(track1.points).to.equal(1);
        expect(track2.points).to.equal(1);
        done();
    });
});