var assert = require("assert");
var mongoose = require("mongoose");

var clientSchema = require("../schemas/client");

describe("Client Schema Tests", function () {
    var Client = mongoose.model("Client", clientSchema, "clients");

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

    it("has a area field that's required string", function (done) {
        var client = new Client({});
        client.validate(function (err) {
            assert.ok(err);

            assert.equal(err.errors["area"].kind, "required");

            client.name = "Gabriel";
            assert.equal(client.name, "Gabriel");
            done();
        });
    });

    it("has a frequency field that's required string", function (done) {
        var client = new Client({});
        client.validate(function (err) {
            assert.ok(err);

            assert.equal(err.errors["frequency"].kind, "required");

            client.name = "Gabriel";
            assert.equal(client.name, "Gabriel");
            done();
        });
    });

    it("has a ability field that's required string", function (done) {
        var client = new Client({});
        client.validate(function (err) {
            assert.ok(err);

            assert.equal(err.errors["ability"].kind, "required");

            client.name = "Gabriel";
            assert.equal(client.name, "Gabriel");
            done();
        });
    });
});

