var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function (wagner, Config) {
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
        Visit : Visit
    };

     _.each(models, function(value, key) {
        wagner.factory(key, function (){
            return value;
        });
    });

    return models;

}
