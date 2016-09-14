var assert = require('assert');
var superagent = require('superagent');
var status = require('http-status');    
var bodyparser = require('body-parser');
var jwt    = require('jsonwebtoken');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3001';

module.exports = function (User) {

    var User = User;

    describe('Auth API', function () {

        beforeEach(function (done) {
            User.remove({}, function (error) {
                assert.ifError(error);
                done();
            });
        });

        beforeEach(function (done) {
            var data = {
                '_id' : '000000000000000000000001',
                'username' : 'gabriel',
                'email' : 'gabriel@teste.com',
                'password' : '12345678'
            }
            User.create(data, function (err) {
                assert.ifError(err);
                done();
            });
        });

        it('verify authentication and if has authorization', function (done) {
            var url = URL_ROOT + '/authenticate';

            superagent.post(url)
                .send({
                    'username' : "gabriel",
                    'password' : '12345678'
                })
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);
                    assert.ok(res.headers.hasOwnProperty('x-access-token'));
                    assert.ok(res.headers.authorization);

                    var results;
                    assert.doesNotThrow(function (){
                        results = JSON.parse(res.text);
                    });

                    assert.ok(results.token);
                    done();
                });
        });

        it('verify the token in requisition', function (done) {
            var url = URL_ROOT + '/verifyJWT';

            var user = {
                '_id' : '000000000000000000000001',
                'username' : 'gabriel',
                'email' : 'gabriel@teste.com',
            };

            var Config = wagner.invoke(function(Config) {
                return Config;
            });

            var token = jwt.sign(user, Config.secret);

            superagent.get(url)
                .set('Authorization', token)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);
                    done();
                });
        });

        it('should return error because not passed the token', function (done) {
            var url = URL_ROOT + '/verifyJWT';

            superagent.get(url)
                .end(function (error, res) {
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, 'Token not found');
                    done();
                });
        });

        it('should return error because the token is wrong', function (done) {
            var url = URL_ROOT + '/verifyJWT';
            var token = "Wrong-Token";

            superagent.get(url)
                .set('Authorization', token)
                .end(function (error, res) {
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, 'Token Invalid');
                    done();
                });
        });

        it('should return error because the user is not found', function (done) {
            var url = URL_ROOT + '/verifyJWT';
            var token = "Wrong-Token";

             var user = {
                'username' : 'User Not Registred',
                'email' : 'visit@teste.com',
            };

            var Config = wagner.invoke(function(Config) {
                return Config;
            });

            var token = jwt.sign(user, Config.secret);

            superagent.get(url)
                .set('Authorization', token)
                .end(function (error, res) {
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, 'User not found');
                    done();
                });
        });

        it('should return error because the user._id is invalid', function (done) {
            var url = URL_ROOT + '/verifyJWT';
            var token = "Wrong-Token";

             var user = {
                '_id' : '1',
                'username' : 'User Not Registred',
                'email' : 'visit@teste.com',
            };

            var Config = wagner.invoke(function(Config) {
                return Config;
            });

            var token = jwt.sign(user, Config.secret);

            superagent.get(url)
                .set('Authorization', token)
                .end(function (error, res) {
                    assert.equal(res.status, status.INTERNAL_SERVER_ERROR);
                    assert.equal(res.body.message, 'CastError: Cast to ObjectId failed for value "1" at path "_id"');
                    done();
                });
        });

    });
}
