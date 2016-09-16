var assert = require("assert");
var superagent = require("superagent");
var status = require("http-status");
var bodyparser = require("body-parser");
var wagner = require("wagner-core");
var jwt    = require("jsonwebtoken");

var URL_ROOT = "http://localhost:3001";

module.exports = function () {

    describe("Visit API", function () {
        var Client;
        var User;
        var Config;
        var Visit;
        var user;
        var token;

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

            Visit = wagner.invoke(function(Visit) {
                return Visit;
            });

            user = {
                "_id" : "000000000000000000000001",
                "username" : "Gabriel",
                "email" : "gabriel@teste.com",
            };

            done();
        });

        beforeEach(function (done) {
            Visit.remove({}, function (error) {
                assert.ifError(error);
                Client.remove({}, function (error) {
                    assert.ifError(error);
                    User.remove({}, function (error) {
                        assert.ifError(error);
                        done();
                    });
                });
            });
        });

        beforeEach(function (done) {
            var clients = [
                {
                "_id" : "000000000000000000000001",
                "name" : "Gabriel",
                "address" : "Street 23",
                "city"  : "London"
                },
                {
                "_id" : "000000000000000000000002",
                "name" : "Gonçalves",
                "address" : "Street 32",
                "city"  : "London"
                },
            ];

            var createUser = {
                "_id" : "000000000000000000000001",
                "username" : "Gabriel",
                "email" : "gabriel@teste.com",
                "password" : "12345678"
            };

            var createVisits = {
                "client" : clients[0],
                "user"  :   createUser,
                "visit_date" : new Date,
                "sales_quantity" : 100,
                "value_received" : 250
            };

            Client.create(clients, function (err) {
                assert.ifError(err);
                User.create(createUser, function (err) {
                    assert.ifError(err);
                    Visit.create(createVisits, function (err) {
                        assert.ifError(err);
                        token = jwt.sign(user, Config.secret);
                        done();
                    });
                });
            });
        });

        it("should not show all visits because isn't authenticate", function (done) {
            var url = URL_ROOT + "/visit";

            superagent.get(url)
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, "Token not found");
                    done();
                });
        });

        it("should show all visits", function (done) {
            var url = URL_ROOT + "/visit";

            superagent.get(url)
                .set("Authorization", token)
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

        it("should return all visits of client selected by id", function (done) {
            var url = URL_ROOT + "/visit/search?client=000000000000000000000001";

            superagent.get(url)
                .set("Authorization", token)
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

        it("should return all visits of client selected by id ordered by date of last visit", function (done) {
            var url = URL_ROOT + "/visit/search?client=000000000000000000000001&lastVisit=1";

            superagent.get(url)
                .set("Authorization", token)
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

        it("can create a Visit", function (done) {
            var url = URL_ROOT + "/visit";

            superagent.post(url)
                .set("Authorization", token)
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
        it("can't create a Visit because don't have a token", function (done) {
            var url = URL_ROOT + "/visit/";

            superagent.post(url)
                .send({
                    //Data of visit to be created
                })
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, "Token not found");
                    done();
                });
        });

    });
};
