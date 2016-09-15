var mongoose = require('mongoose');
var _ = require('underscore');
var wagner = require('wagner-core');

module.exports = function (Config) {

    var urlMongo =   Config.host + ':' + 
                Config.port + '/' + 
                Config.database;

    mongoose.connect(urlMongo);

    wagner.factory('db', function(){
        return mongoose;
    });

    var User = mongoose.model('User', require('./user'), 'users');
    var Client = mongoose.model('Client', require('./client'), 'clients');
    var Visit = mongoose.model('Visit', require('./visit'), 'visits');

    var models = {
        User : User,
        Client : Client,
        Visit : Visit,
        Config: Config
    };

     _.each(models, function(value, key) {
        wagner.factory(key, function (){
            return value;
        });
    });

    return models;

}
