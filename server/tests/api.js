global.rootRequire = function(name) {
    return require(require('path').dirname(__filename) + '/../' + name);
}

var assert = require('assert');
var express = require('express');
var wagner = require('wagner-core');
var superagent = require('superagent');
var _ = require('underscore');
var status = require('http-status');
var bodyparser = require('body-parser');

var URL_ROOT = 'http://localhost:3001';

describe("Tests API", function() {
    var server;
    var Client;
    var config = {
            "host" : "mongodb://localhost",
            "port" : "27017",
            "database" : "iclient_test",
            "secret" : "Keysecret-Teste"
        };

    var models = rootRequire('models/models')(wagner, config);
    var deps = wagner.invoke(function(Client, User, Config) {
        return {
            Client : Client,
            User : User
        }
    });

    Client = deps.Client;
    User = deps.User;

    before(function () {
        var app = express();
        app.use(bodyparser.json());

        rootRequire('auth')(wagner, app, config);
        app.use(rootRequire('api/v1/api')(wagner, config));

        server = app.listen(3001);
    });

    after(function(){
        server.close();
    });

    rootRequire('/tests/auth')(User);
    rootRequire('/tests/client_api')(Client);
});
