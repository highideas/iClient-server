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

            var today = new Date;
            var tomorrow = new Date(today.getTime() + 86400000);

            var createVisits = [
                {
                    "client" : clients[0],
                    "visit_date" : today,
                    "sales_quantity" : 100,
                    "value_received" : 250
                },
                {
                    "client" : clients[1],
                    "visit_date" : today,
                    "sales_quantity" : 100,
                    "value_received" : 250
                },
                {
                    "client" : clients[0],
                    "visit_date" : tomorrow,
                    "sales_quantity" : 100,
                    "value_received" : 250
                },

            ];
            Client.create(clients, function (err, clients) {
                assert.ifError(err);
                User.create(createUser, function (err, user) {
                    assert.ifError(err);
                    var visitCreates = [];
                    createVisits.forEach(function (visits) {
                        visits.user = user;
                        visitCreates.push(visits);
                    });
                    Visit.create(visitCreates, function (err, visits) {
                        assert.ifError(err);
                        token = jwt.sign(user.attributes, Config.secret);
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

                    assert.equal(results.length, 3);

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
                    assert.ok(results[0].visit_date > results[1].visit_date);
                    done();
                });
        });

        it("should return all visits of user selected by id", function (done) {
            var url = URL_ROOT + "/visit/search?user=000000000000000000000001";

            superagent.get(url)
                .set("Authorization", token)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);

                    var results;
                    assert.doesNotThrow(function (){
                        results = JSON.parse(res.text).visits;
                    });

                    assert.equal(results.length, 3);
                    done();
                });
        });

        it("should return all visits of user selected by id ordered by date of last visit", function (done) {
            var url = URL_ROOT + "/visit/search?user=000000000000000000000001&lastVisit=1";

            superagent.get(url)
                .set("Authorization", token)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);

                    var results;
                    assert.doesNotThrow(function (){
                        results = JSON.parse(res.text).visits;
                    });

                    assert.equal(results.length, 3);
                    assert.ok(results[2].date > results[0].date);
                    done();
                });
        });

        it("can create a Visit", function (done) {
            var url = URL_ROOT + "/visit";

            var visit = {
                "client" : {
                    "_id" : "000000000000000000000001",
                    "name" : "Gabriel",
                    "address" : "Street 23",
                    "city"  : "London"
                },
                "user"  :   {
                    "_id" : "000000000000000000000001",
                    "username" : "Gabriel",
                    "email" : "gabriel@teste.com",
                    "password" : "12345678"
                },
                "visit_date" : new Date,
                "sales_quantity" : 100,
                "value_received" : 250
            }

            superagent.post(url)
                .set("Authorization", token)
                .send(visit)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);
                    Visit.find({}, function (error, visits) {
                        assert.ifError(error);
                        assert.equal(visits.length, 2);
                        done();
                    });
                });
        });

        it("can't create a Visit because don't have a token", function (done) {
            var url = URL_ROOT + "/visit/";

            superagent.post(url)
                .send({})
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, "Token not found");
                    done();
                });
        });

        it("can update a Visit", function (done) {
            var url = URL_ROOT + "/visit/000000000000000000000001";

            var visit = {
                "sales_quantity" : 200,
                "value_received" : 500
            }

            superagent.put(url)
                .set("Authorization", token)
                .send(visit)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);
                    Visit.find({ "_id" : "000000000000000000000001"}, function (error, visits) {
                        assert.ifError(error);
                        assert.equal(visits.length, 1);
                        assert.equal(visits[0].sales_quantity, 200);
                        assert.equal(visits[0].value_received, 500);
                        done();
                    });
                });
        });

        it("can't update a Visit because don't have a token", function (done) {
            var url = URL_ROOT + "/visit/";

            superagent.put(url)
                .send({})
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, "Token not found");
                    done();
                });
        });

        it("can delete a Visit", function (done) {
            var url = URL_ROOT + "/visit/000000000000000000000001";

            superagent.del(url)
                .set("Authorization", token)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);
                    Visit.find({"_id" : "000000000000000000000001"}, function (error, visits) {
                        assert.ifError(error);
                        assert.equal(visits.length, 0);
                        done();
                    });
                });
        });

        it("can't delete a Visit because don't have a token", function (done) {
            var url = URL_ROOT + "/visit/";

            superagent.del(url)
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, "Token not found");
                    done();
                });
        });

    });
};
