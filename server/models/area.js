var mongoose = require("mongoose");

var Area = mongoose.model("Area", rootRequire("schemas/area"), "areas");

module.exports = Area;
