var status = require("http-status");
var wagner = require("wagner-core");

var verifyJWT = rootRequire("middleware/verifyJWT");

module.exports = function (api) {

    api.get("/visit", verifyJWT, wagner.invoke(function (Visit) {
        return function (req, res) {
            
            Visit.find({}, function (error, visits) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error : error.toString() });
                }
                if (!visits) {
                    return res.
                        status(status.NOT_FOUND).
                        json({ error: "Not Found"});
                }

                res.json({ visits : visits});
            }); 
        };
    }));

    api.get("/visit/search", verifyJWT, wagner.invoke(function (Visit) {
        return function (req, res) {
            var query = Visit.acceptable_params_filter(req.query);
            var sort = {};
            if (req.query.lastVisit == 1) {
                sort = {"visit_date" : -1 };
            }

            Visit.find(query).sort(sort).exec(function (error, visits) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error : error.toString() });
                }
                if (!visits) {
                    return res.
                        status(status.NOT_FOUND).
                        json({ error: "Not Found"});
                }

                res.json({ visits : visits});
            });
        };
    }));
    return api;
};
