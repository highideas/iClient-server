var assert = require('assert');
var superagent = require('superagent');
var status = require('http-status');
var bodyparser = require('body-parser');
var wagner = require('wagner-core');
var jwt    = require('jsonwebtoken');

var URL_ROOT = 'http://localhost:3001';

module.exports = function () {

    describe('Clients API', function () {
        var Client;
        var User;
        var Config;
        var user;

        before(function (done) {
            Client = wagner.invoke(function(Client) {
                return Client;
            });
            User = wagner.invoke(function(User) {
                return User;
            });
            Config = wagner.invoke(function(Config) {
                return Config;
            });

            user = {
                '_id' : '000000000000000000000001',
                'username' : 'gabriel',
                'email' : 'gabriel@teste.com',
            };

            done();
        });

        beforeEach(function (done) {
            Client.remove({}, function (error) {
                assert.ifError(error);
                User.remove({}, function (error) {
                    assert.ifError(error);
                    done();
                });
            });
        });

        beforeEach(function (done) {
            var clients = [
                {
                "_id" : '000000000000000000000001',
                "name" : "Gabriel",
                "address" : "Street 23",
                "city"  : "London"
                },
                {
                "_id" : '000000000000000000000002',
                "name" : "Gonçalves",
                "address" : "Street 32",
                "city"  : "Madrid"
                },
            ];

            var createUser = {
                '_id' : '000000000000000000000001',
                'username' : 'gabriel',
                'email' : 'gabriel@teste.com',
                'password' : '12345678'
            }

            Client.create(clients, function (err) {
                assert.ifError(err);
                User.create(createUser, function (err) {
                    assert.ifError(err);
                    done();
                });
            });
        });

        it('return all clients', function (done) {
            var url = URL_ROOT + '/client';

            var token = jwt.sign(user, Config.secret);

            superagent.get(url)
                .set('Authorization', token)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);

                    var results;
                    assert.doesNotThrow(function (){
                        results = JSON.parse(res.text).clients;
                    });

                    assert.equal(results.length, 2);
                    done();
                });
        });

        it('should not return all clients because don\'t have a token valid', function (done) {
            var url = URL_ROOT + '/client';

            superagent.get(url)
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, 'Token not found');
                    done();
                });
        });

        it('return a client by name', function (done) {
            var url = URL_ROOT + '/client/name/Gabriel';
            var token = jwt.sign(user, Config.secret);

            superagent.get(url)
                .set('Authorization', token)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);

                    var results;
                    assert.doesNotThrow(function (){
                        results = JSON.parse(res.text).client;
                    });

                    assert.equal(results.length, 1);
                    assert.equal(results[0].name, "gabriel");
                    done();
                });
        });

        it('should not return a client by name because don\'t have a token', function (done) {
            var url = URL_ROOT + '/client/name/Gabriel';

            superagent.get(url)
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, 'Token not found');
                    done();
                });
        });

        it('can create a Client', function (done) {
            var url = URL_ROOT + '/client/';
            var token = jwt.sign(user, Config.secret);

            superagent.post(url)
                .set('Authorization', token)
                .send({
                    'name' : 'New Client',
                    'address' : 'New Address to New Client',
                    'city' : 'New City to New Client'
                })
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);
                    Client.find({}, function (error, clients) {
                        assert.ifError(error);
                        assert.equal(clients.length, 3);
                        done();
                    });
                });
        });

        it('can\'t create a Client because don\'t have a token', function (done) {
            var url = URL_ROOT + '/client/';

            superagent.post(url)
                .send({
                    'name' : 'New Client',
                    'address' : 'New Address to New Client',
                    'city' : 'New City to New Client'
                })
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, 'Token not found');
                    done();
                });
        });

        it('can\'t create a Client invalid', function (done) {
            var url = URL_ROOT + '/client/';
            var token = jwt.sign(user, Config.secret);

            superagent.post(url)
                .set('Authorization', token)
                .send({
                    'name' : 'New Client',
                    'address' : 'New Address to New Client',
                })
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.INTERNAL_SERVER_ERROR);
                    assert.equal(res.body.error, "ValidationError: Path `city` is required.");
                    Client.find({}, function (error, clients) {
                        assert.ifError(error);
                        assert.equal(clients.length, 2);
                        done();
                    });
                });
        });

         it('can update a Client', function (done) {
            var url = URL_ROOT + '/client/id/000000000000000000000001';
            var token = jwt.sign(user, Config.secret);

            superagent.put(url)
                .set('Authorization', token)
                .send({
                    'name' : 'Update Client',
                })
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);

                    Client.find({'_id' : '000000000000000000000001'}, function (error, client) {
                        assert.ifError(error);
                        assert.equal(client.length, 1);
                        assert.equal(client[0].name, 'Update Client');
                        assert.equal(client[0].address, 'Street 23');
                        assert.equal(client[0].city, 'London');
                        done();
                    });
                });
        });

        it('can\'t update a Client because don\'t have a token', function (done) {
            var url = URL_ROOT + '/client/id/000000000000000000000001';

            superagent.put(url)
                .send({
                    'name' : 'Update Client',
                })
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, 'Token not found');
                    done();
                });
        });

        it('can delete a Client', function (done) {
            var url = URL_ROOT + '/client/id/000000000000000000000001';
            var token = jwt.sign(user, Config.secret);

            superagent.del(url)
                .set('Authorization', token)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);

                    Client.find({'_id' : '000000000000000000000001'}, function (error, client) {
                        assert.ifError(error);
                        assert.equal(client.length, 0);
                        done();
                    });
                });
        });

        it('can\'t delete a Client because don\'t have a token', function (done) {
            var url = URL_ROOT + '/client/id/000000000000000000000001';

            superagent.del(url)
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, 'Token not found');
                    done();
                });
        });
    });
}
