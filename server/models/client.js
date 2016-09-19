var mongoose = require("mongoose");

var Client = mongoose.model("Client", rootRequire("schemas/client"), "clients");

module.exports = Client;
