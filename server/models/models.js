var mongoose = require("mongoose");
var _ = require("underscore");
var wagner = require("wagner-core");

module.exports = function (Config) {

    var urlMongo =   Config.host + ":" +
                Config.port + "/" +
                Config.database;

    mongoose.connect(urlMongo);

    var User    = require("./user");
    var Client  = require("./client");
    var Visit   = require("./visit");

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
};
