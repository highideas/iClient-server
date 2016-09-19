var mongoose = require("mongoose");

var Visit = mongoose.model("Visit", rootRequire("schemas/visit"), "visits");

Visit.search = function(params, callback) {
    var sort = {};

    if (params.lastVisit == 1) {
        sort = {"visit_date" : -1 };
    }

    var query = Visit.acceptable_params_filter(params);

    Visit.find(query)
        .sort(sort)
        .then(function(visit) {
            callback(null, visit);
        });
}

Visit.acceptable_params_filter = function(params) {

    var acceptable = ["client", "user"];
    var _query = {};

    Object.keys(params).forEach(function(key) {
        if (acceptable.indexOf(key) !== -1) {
            _query[key + "._id"] =  new mongoose.Types.ObjectId(params[key]);
        }
    });
    // retorno o 'res.query' só com as chaves aceitas
    return _query;
}

module.exports = Visit;
