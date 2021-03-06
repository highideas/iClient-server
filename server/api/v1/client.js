'use strict'
var status = require("http-status");
var wagner = require("wagner-core");

var verifyJWT = rootRequire("middleware/verifyJWT");

module.exports = function (api) {

    api.get("/client", verifyJWT, wagner.invoke(function (Client) {
        return function (req, res) {
            Client.find({}, function (error, clients) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error : error.toString() });
                }
                if (clients.length <= 0) {
                    return res.
                        status(status.NOT_FOUND).
                        json({ error: "Not Found"});
                }

                res.json({ clients: clients});
            });
        };
    }));

    api.get("/client/search", verifyJWT, wagner.invoke(function (Client) {
        return function (req, res) {
            Client.search(req.query, function (error, client) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error : error.toString() });
                }
                if (client.length <= 0) {
                    return res.
                        status(status.NOT_FOUND).
                        json({ error: "Not Found"});
                }

                res.json({ client: client});
            });
        };
    }));

    api.get("/client/:id", verifyJWT, wagner.invoke(function (Client) {
        return function (req, res) {
            let query = {"_id" : req.params.id};
            Client.find(query, function (error, client) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error : error.toString() });
                }
                if (client.length <= 0) {
                    return res.
                        status(status.NOT_FOUND).
                        json({ error: "Not Found"});
                }

                res.json({ client: client});
            });
        };
    }));

    api.post("/client", verifyJWT, wagner.invoke(function (Client) {
        return function (req, res) {
            Client.create(req.body, function (error, client) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error: error.toString()});
                }

                return res.status(status.CREATED).json({ client: client});
            });
        };
    }));

    api.put("/client/:id", verifyJWT, wagner.invoke(function (Client) {
        return function (req, res) {
            var query = {"_id" : req.params.id};
            Client.update(query, { $set : req.body}, {}, function (error, client) {
                if (error) {
                    return res.
                        status(status.INTERNAL_SERVER_ERROR).
                        json({ error: error.toString()});
                }

                return res.json({ client: client});
            });
        };
    }));

    api.delete("/client/:id", verifyJWT, wagner.invoke(function (Client) {
        return function (req, res) {
            var query = {"_id" : req.params.id};
            Client.remove(query, function (error) {
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
