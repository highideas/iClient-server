var status = require("http-status");
var jwt    = require("jsonwebtoken");
var wagner = require("wagner-core");

module.exports = function (req, res, next) {

    if (!req.headers.authorization) {
        return res.status(status.UNAUTHORIZED).json({ success: false, message: "Token not found" });
    }

    var User = wagner.invoke(function(User) {
        return User;
    });

    var Config = wagner.invoke(function(Config) {
        return Config;
    });

    var token = req.headers.authorization;
    jwt.verify(token, Config.secret, function(err, user) {
        if (err) {
            return res.status(status.UNAUTHORIZED).json({ success: false, message: "Token Invalid" });
        }
        User.findOne({"_id" : user._id}, function (err, user) {
            if (err) {
                return res.status(status.INTERNAL_SERVER_ERROR).json({ success: false, message: err.toString() });
            }

            if (!user) {
                return res.status(status.UNAUTHORIZED).json({ success: false, message: "User not found" });
            }
            req.user = user;
            next();
        });
    });

};
