global.rootRequire = function(name) {
    return require(require("path").dirname(__filename) + "/../" + name);
};

var express = require("express");
var wagner = require("wagner-core");
var superagent = require("superagent");
var bodyparser = require("body-parser");
var Config = rootRequire('config_test');

var URL_ROOT = "http://localhost:3001";

describe("Tests API", function() {
    var server;
    var Client;
    var models = rootRequire("models/models")(Config);

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

    rootRequire("/test/auth")();
    rootRequire("/test/client_api")();
    rootRequire("/test/visit_api")();
    rootRequire("/test/area_api")();
});
