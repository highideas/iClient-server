global.rootRequire = function(name) {
    return require(require("path").dirname(__filename) + "/../" + name);
};

var express = require("express");
var wagner = require("wagner-core");
var superagent = require("superagent");
var bodyparser = require("body-parser");

var URL_ROOT = "http://localhost:3001";

describe("Tests API", function() {
    var server;
    var Client;
    var config = {
        "host" : "mongodb://localhost",
        "port" : "27017",
        "database" : "iclient_test",
        "secret" : "Keysecret-Teste"
    };

    var models = rootRequire("models/models")(config);

    before(function () {
        var app = express();
        app.use(bodyparser.json());

        rootRequire("auth")(app);
        app.use(rootRequire("api/v1/api")());

        server = app.listen(3001);
    });

    after(function(){
        server.close();
    });

    rootRequire("/tests/auth")();
    rootRequire("/tests/client_api")();
    rootRequire("/tests/visit_api")();
});
