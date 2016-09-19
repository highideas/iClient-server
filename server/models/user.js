var mongoose = require("mongoose");

var User = mongoose.model("User", rootRequire("schemas/user"), "users");

module.exports = User;
