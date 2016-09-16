var assert = require("assert");
var mongoose = require("mongoose");

var clientSchema = require("../models/client");

describe("Client Schema Tests", function () {
    var Client = mongoose.model("Client", clientSchema, "client");

    it("has a name field that's required string", function (done) {
        var client = new Client({});
        client.validate(function (err) {
            assert.ok(err);

            assert.equal(err.errors["name"].kind, "required");

            client.name = "Gabriel";
            assert.equal(client.name, "Gabriel");
            done();
        });
    });
    it("has a city field that's required string", function (done) {
        var client = new Client({});
        client.validate(function (err) {
            assert.ok(err);

            assert.equal(err.errors["city"].kind, "required");

            client.city = "London";
            assert.equal(client.city, "London");
            done();
        });

    });
    it("has a address field that's required string", function (done) {
        var client = new Client({});
        client.validate(function (err) {
            assert.ok(err);

            assert.equal(err.errors["address"].kind, "required");

            client.address = "Street 23";
            assert.equal(client.address, "Street 23");
            done();
        });

    });
});

