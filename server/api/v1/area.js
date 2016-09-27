var status = require("http-status");
var wagner = require("wagner-core");

var verifyJWT = rootRequire("middleware/verifyJWT");

module.exports = function (api) {

    api.get("/area", verifyJWT, wagner.invoke(function (Area) {
        return function (req, res) {
            Area.find({}, function (error, areas) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error : error.toString() });
                }
                if (areas.length <= 0) {
                    return res.
                        status(status.NOT_FOUND).
                        json({ error: "Not Found"});
                }

                res.json({ areas: areas});
            });
        };
    }));

    api.post("/area", verifyJWT, wagner.invoke(function (Area) {
        return function (req, res) {
            Area.create(req.body, function (error, area) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error: error.toString()});
                }

                return res.json({ area: area});
            });
        };
    }));

    api.put("/area/:id", verifyJWT, wagner.invoke(function (Area) {
        return function (req, res) {
            var query = {"_id" : req.params.id};
            Area.update(query, { $set : req.body}, {}, function (error, area) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error: error.toString()});
                }

                return res.json({ area: area});
            });
        };
    }));

    api.delete("/area/:id", verifyJWT, wagner.invoke(function (Area) {
        return function (req, res) {
            var query = {"_id" : req.params.id};
            Area.remove(query, function (error) {
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
}
