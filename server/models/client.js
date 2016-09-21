var mongoose = require("mongoose");

var Client = mongoose.model("Client", rootRequire("schemas/client"), "clients");

Client.search = function(params, callback) {

    var query = Client.acceptable_params_filter(params);

    if (Object.keys(query).length >= 1) {

        return Client.find(query)
                .then(function(visit) {
                    callback(null, visit);
                });
    }

    return callback("Query invalid", null);
}

Client.acceptable_params_filter = function(params) {

    var acceptable = ["address", "name", "city", "area"];
    var _query = {};

    Object.keys(params).forEach(function(key) {
        if (acceptable.indexOf(key) !== -1) {
            _query[key] =  params[key];
        }
    });

    return _query;
}
module.exports = Client;
