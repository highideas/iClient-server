var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');

module.exports = function (wagner) {
    var app = express.Router();

    app.use(bodyparser.json());

    app = rootRequire('/api/v1/client')(wagner, app);
    app = rootRequire('/api/v1/auth')(wagner, app);
    
    return app;
};
