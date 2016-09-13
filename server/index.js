global.rootRequire = function(name) {
    return require(require('path').dirname(require.main.filename) + '/' + name);
}

var express = require('express');
var wagner = require('wagner-core');
var bodyParser  = require('body-parser')
var Config = rootRequire('config');

var jwt    = require('jsonwebtoken');

rootRequire('models/models')(wagner, Config);

var app = express();

var fs = require('fs');
var accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log',{flags: 'a'});
app.use(require('morgan')('combined', {stream: accessLogStream}));

app.use(function(req, res, next) {
    res.append('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.append('Access-Control-Allow-Credentials', 'true');
    res.append('Access-Control-Allow-Methods', ['GET', 'OPTIONS', 'PUT', 'POST']);
    res.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.set('superSecret', Config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1', rootRequire('api/v1/api')(wagner));

app.listen(3000);
console.log('Listening on port 3000!');

