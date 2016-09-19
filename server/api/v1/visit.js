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

            Visit.search(req.query, function (error, visits) {
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

                return res.json({ visits : visits});

            });
        };
    }));

    api.post("/visit", verifyJWT, wagner.invoke(function (Visit) {
        return function (req, res) {
            Visit.create(req.body, function (error, visit) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error: error.toString()});
                }

                return res.json({ visit: visit });
            });
        };
    }));

    api.put("/visit/:id", verifyJWT, wagner.invoke(function (Visit) {
        return function (req, res) {
            var query = {"_id" : req.params.id};
            Visit.update(query, { $set : req.body}, {}, function (error, visit) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error: error.toString()});
                }

                return res.json({ visit: visit});
            });
        };
    }));

    api.delete("/visit/:id", verifyJWT, wagner.invoke(function (Visit) {
        return function (req, res) {
            var query = {"_id" : req.params.id};
            Visit.remove(query, function (error) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error: error.toString()});
                }
                res.json({sucess: status.OK});
            });
        };
    }));

    return api;
};
