var assert = require("assert");
var mongoose = require("mongoose");

var areaSchema = require("../schemas/area");

describe("Area Schema Tests", function () {
    var Area = mongoose.model("Area", areaSchema, "areas");

    it("has a _id field that's required string", function (done) {
        var area = new Area({});
        area.validate(function (err) {
            assert.ok(err);

            assert.equal(err.errors["_id"].kind, "required");

            area._id = "Centro";
            assert.equal(area._id, "Centro");
            done();
        });
    });
});
