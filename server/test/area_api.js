var assert = require("assert");
var superagent = require("superagent");
var status = require("http-status");
var bodyparser = require("body-parser");
var wagner = require("wagner-core");
var jwt    = require("jsonwebtoken");
var sinon = require("sinon");

var URL_ROOT = "http://localhost:3001";

module.exports = function () {

    describe('Area API', function () {
        var User;
        var Config;
        var Area;
        var user;
        var token;

        before(function (done) {
            User = wagner.invoke(function(User) {
                return User;
            });
            Area = wagner.invoke(function(Area){
                return Area;
            });
            Config = wagner.invoke(function(Config) {
                return Config;
            });

            user = {
                "_id" : "000000000000000000000001",
                "username" : "Gabriel",
                "email" : "gabriel@teste.com",
            };

            done();
        });

        beforeEach(function (done) {
            Area.remove({}, function (error) {
                assert.ifError(error);
                User.remove({}, function (error) {
                    assert.ifError(error);
                    done();
                });
            });
        });

        beforeEach(function (done) {

            var createAreas = [
                {
                    '_id' : "Center",
                    'parent' : "",
                    'ancestors': []
                },
                {
                    '_id' : "South",
                    'parent' : "",
                    'ancestors' : []
                }
            ];

            var createUser = {
                "_id" : "000000000000000000000001",
                "username" : "Gabriel",
                "email" : "gabriel@teste.com",
                "password" : "12345678"
            };

            Area.create(createAreas, function (err) {
                assert.ifError(err);
                User.create(createUser, function (err) {
                    assert.ifError(err);
                    token = jwt.sign(user, Config.secret);
                    done();
                });
            });
        });

        it("return all areas", function (done) {
            var url = URL_ROOT + "/area";

            superagent.get(url)
                .set("Authorization", token)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);

                    var results;
                    assert.doesNotThrow(function (){
                        results = JSON.parse(res.text).areas;
                    });

                    assert.equal(results.length, 2);
                    done();
                });
        });

        it("should return http status error when error on Area mongoose", function (done) {
            var url = URL_ROOT + "/area";

            stubArea = sinon.stub(Area, 'find', function(obj, callback) {
                callback(new Error('An Error Has Occurred'), []);
            });

            superagent.get(url)
                .set("Authorization", token)
                .end(function (error, res) {
                    stubArea.restore();
                    assert.ok(error);
                    assert.equal(res.status, status.INTERNAL_SERVER_ERROR);
                    done();
                });
        });

        it("should not return areas because don't have areas registred", function (done) {
            var url = URL_ROOT + "/area";
            Area.remove({}, function (error) {
                assert.ifError(error);
                superagent.get(url)
                    .set("Authorization", token)
                    .end(function (error, res) {
                        assert.equal(res.status, status.NOT_FOUND);

                        var results;
                        assert.doesNotThrow(function (){
                            results = JSON.parse(res.text).error;
                        });

                        assert.equal(results, "Not Found");
                        done();
                    });
            });
        });

        it("should not return all areas because don't have a token valid", function (done) {
            var url = URL_ROOT + "/area";

            superagent.get(url)
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, "Token not found");
                    done();
                });
        });

        it("can create a Area", function (done) {
            var url = URL_ROOT + "/area/";

            superagent.post(url)
                .set("Authorization", token)
                .send({
                    "_id" : "New Area",
                    "parent" : "Center",
                    "ancestors" : ["Center"],
                })
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.CREATED);
                    Area.find({}, function (error, areas) {
                        assert.ifError(error);
                        assert.equal(areas.length, 3);
                        done();
                    });
                });
        });

        it("can't create a Area because don't have a token", function (done) {
            var url = URL_ROOT + "/area/";

            superagent.post(url)
                .send({
                    "_id" : "New Area",
                    "parent" : "Center",
                    "ancestors" : ["Center"]
                })
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, "Token not found");
                    done();
                });
        });

        it("can't create a Area invalid", function (done) {
            var url = URL_ROOT + "/area/";

            superagent.post(url)
                .set("Authorization", token)
                .send({
                    "parent" : "Center",
                    "ancestors"  : ["Center"],
                })
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.INTERNAL_SERVER_ERROR);
                    assert.equal(res.body.error, "ValidationError: Path `_id` is required.");
                    Area.find({}, function (error, areas) {
                        assert.ifError(error);
                        assert.equal(areas.length, 2);
                        done();
                    });
                });
        });

        it("can update a Area", function (done) {
            var url = URL_ROOT + "/area/Center";

            superagent.put(url)
                .set("Authorization", token)
                .send({
                    "parent" : "Update Parent",
                })
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);

                    Area.find({"_id" : "Center"}, function (error, area) {
                        assert.ifError(error);
                        assert.equal(area.length, 1);
                        assert.equal(area[0].parent, "Update Parent");
                        done();
                    });
                });
        });

        it("can't update a Area because have a server error on Area mongoose", function (done) {
            var url = URL_ROOT + "/area/Center";

            stubArea = sinon.stub(Area, 'update', new Error('An Error Has Occurred'));

            superagent.put(url)
                .set("Authorization", token)
                .send({
                    "_id" : "Update Client",
                })
                .end(function (error, res) {
                    stubArea.restore();
                    assert.ok(error);
                    assert.equal(res.status, status.INTERNAL_SERVER_ERROR);
                    done();
                });
        });

        it("can't update a Area because don't have a token", function (done) {
            var url = URL_ROOT + "/area/Center";

            superagent.put(url)
                .send({
                    "name" : "Update Area",
                })
                .end(function (error, res) {
                    assert.ok(error);
                    assert.equal(res.status, status.UNAUTHORIZED);
                    assert.equal(res.body.message, "Token not found");
                    done();
                });
        });

        it("can delete a Area", function (done) {
            var url = URL_ROOT + "/area/Center";

            superagent.del(url)
                .set("Authorization", token)
                .end(function (error, res) {
                    assert.ifError(error);
                    assert.equal(res.status, status.OK);

                    Area.find({"_id" : "Center"}, function (error, area) {
                        assert.ifError(error);
                        assert.equal(area.length, 0);
                        done();
                    });
                });
        });

        it("can't delete a Area because have a server error on Area mongoose", function (done) {
            var url = URL_ROOT + "/area/Center";

            stubArea = sinon.stub(Area, 'remove', function(obj, callback) {
                callback(new Error('An Error Has Occurred'), []);
            });

            superagent.del(url)
                .set("Authorization", token)
                .end(function (error, res) {
                    stubArea.restore();
                    assert.ok(error);
                    assert.equal(res.status, status.INTERNAL_SERVER_ERROR);
                    done();
                });
        });

        it("can't delete a Area because don't have a token", function (done) {
            var url = URL_ROOT + "/area/Center";

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
