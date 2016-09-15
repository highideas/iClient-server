var assert = require('assert');
var superagent = require('superagent');
var status = require('http-status');
var bodyparser = require('body-parser');
var wagner = require('wagner-core');
var jwt    = require('jsonwebtoken');

var URL_ROOT = 'http://localhost:3001';

module.exports = function () {

    describe('Visit API', function () {

        it('should not show all visits because isn\'t authenticate', function (done) {
            var url = URL_ROOT + '/visit';

            superagent.get(url)
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, 'Token not found');
                    done();
                });
        });

        it('should show all visits', function (done) {
            var url = URL_ROOT + '/visit';

            superagent.get(url)
                .set('Authorization', token)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);

                    var results;
                    assert.doesNotThrow(function (){
                        results = JSON.parse(res.text).visits;
                    });

                    assert.equal(results.length, 2);

                    done();
                });
        });

        it('should return all visits of client selected by id', function (done) {
            var url = URL_ROOT + '/visit/search?client=000000000000000000000001';

            superagent.get(url)
                .set('Authorization', token)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);

                    var results;
                    assert.doesNotThrow(function (){
                        results = JSON.parse(res.text).visits;
                    });

                    assert.equal(results.length, 2);
                    done();
                });
        });

        it('should return all visits of client selected by id ordered by date of last visit', function (done) {
            var url = URL_ROOT + '/visit/search?client=000000000000000000000001&lastVisit=1';

            superagent.get(url)
                .set('Authorization', token)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);

                    var results;
                    assert.doesNotThrow(function (){
                        results = JSON.parse(res.text).visits;
                    });

                    assert.equal(results.length, 2);
                    assert.ok(results[1].date > results[0].date);
                    done();
                });
        });

        it('can create a Visit', function (done) {
            var url = URL_ROOT + '/visit';

            superagent.post(url)
                .set('Authorization', token)
                .send({
                    //Data of visit to be created
                })
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);
                    Visit.find({}, function (error, visits) {
                        assert.ifError(error);
                        assert.equal(visits.length, 3);
                        done();
                    });
                });
        });
        it('can\'t create a Visit because don\'t have a token', function (done) {
            var url = URL_ROOT + '/visit/';

            superagent.post(url)
                .send({
                    //Data of visit to be created
                })
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, 'Token not found');
                    done();
                });
        });

    });
};
