var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');
var wagner = require('wagner-core');

module.exports = function () {
    var app = express.Router();

    app.use(bodyparser.json());

    app = rootRequire('/api/v1/client')(app);
    
    return app;
};
