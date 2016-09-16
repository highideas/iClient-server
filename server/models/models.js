var mongoose = require("mongoose");
var _ = require("underscore");
var wagner = require("wagner-core");

module.exports = function (Config) {

    var urlMongo =   Config.host + ":" +
                Config.port + "/" +
                Config.database;

    mongoose.connect(urlMongo);

    wagner.factory("db", function(){
        return mongoose;
    });

    var User = mongoose.model("User", require("./user"), "users");
    var Client = mongoose.model("Client", require("./client"), "clients");
    var Visit = mongoose.model("Visit", require("./visit"), "visits");

    Visit.search = function(params) {
         // usando modelo para buscar
        Visit.find(Visit.acceptable_params_filter(params), function(error, visit) {
            if (error) {
                return error;
            }
            console.log(visit);
            return visit;
        });
    }

    Visit.acceptable_params_filter = function(params) {
         // só vou aceitar 'client_id' e 'user_id' na url

         var acceptable = ['client', 'user'];
         var _query = {};

         Object.keys(params).forEach(function(key) { 
          if (acceptable.indexOf(key) !== -1) {
           _query[key + "._id"] = params[key];
          }
         });
         // retorno o 'res.query' só com as chaves aceitas
        return _query;
    }

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
