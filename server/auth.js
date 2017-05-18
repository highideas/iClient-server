var status = require("http-status");
var jwt    = require("jsonwebtoken");
var wagner = require("wagner-core");

var verifyJWT = rootRequire("middleware/verifyJWT");

module.exports = function (api) {

    api.post("/authenticate", wagner.invoke(function (User, Config) {
        return function (req, res) {
            User.findOne({"username" : req.body.username }, function (error, user) {
                    if (error) {
                        return res.
                            status(status.INTERNAL_SERVER_ERROR).
                            json({ error: error.toString()});
                    }
                    if (!user || (user.password !== req.body.password)) {
                        return res.status(status.UNAUTHORIZED).json({ success: false, message: "Authentication failed. Login incorrect." });
                    }

                    var token = jwt.sign(user.attributes, Config.secret);

                    res.header("Authorization", token);
                    res.header("x-access-token", token);

                    return res.json({
                        success: status.OK,
                        token: token
                    });
                });
        };
    }));

    api.get("/verifyJWT", verifyJWT, function (req, res) {
        return res.status(status.OK).json({success: status.OK, });
    });

    api.get("/healthcheck", function (req, res) {
            return res.status(status.OK).json({ message: "API is running"});
    });

    return api;
};
