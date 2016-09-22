var mongoose = require("mongoose");

var Visit = mongoose.model("Visit", rootRequire("schemas/visit"), "visits");

Visit.search = function(params, callback) {
    var sort = {};

    if (params.lastVisit == 1) {
        sort = {"visit_date" : -1 };
    }

    var query = Visit.acceptable_params_filter(params);

    if (Object.keys(query).length >= 1) {

        return Visit.find(query)
                .sort(sort)
                .then(function(visit) {
                    callback(null, visit);
                });
    }

    return callback("Query invalid", null);
};

Visit.acceptable_params_filter = function(params) {

    var acceptable = ["client", "user"];
    var _query = {};

    Object.keys(params).forEach(function(key) {
        if (acceptable.indexOf(key) !== -1) {
            _query[key + "._id"] =  new mongoose.Types.ObjectId(params[key]);
        }
    });

    return _query;
};

module.exports = Visit;
