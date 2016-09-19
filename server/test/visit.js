var assert = require("assert");
var mongoose = require("mongoose");

var visitSchema = require("../schemas/visit");

describe("Visit Schema Tests", function () {
    var Visit = mongoose.model("Visit", visitSchema, "visits");

    it("has a visit_date field that's required", function (done) {
        var visit = new Visit({});
        visit.validate(function (err) {
            assert.ok(err);
            assert.equal(err.errors["visit_date"].kind, "required");
            done();
        });
    });
    it("has a sales_quantity field that's required number", function (done) {
        var visit = new Visit({});
        visit.validate(function (err) {
            assert.ok(err);

            assert.equal(err.errors["sales_quantity"].kind, "required");

            visit.sales_quantity = 500;
            assert.equal(visit.sales_quantity, 500);
            done();
        });
    });
    it("has a value_received field that's required number", function (done) {
        var visit = new Visit({});
        visit.validate(function (err) {
            assert.ok(err);

            assert.equal(err.errors["value_received"].kind, "required");

            visit.value_received = 10.50;
            assert.equal(visit.value_received, 10.50);
            done();
        });
    });
});

