var status = require('http-status');
var jwt    = require('jsonwebtoken');

var verifyJWT = rootRequire('middleware/verifyJWT');

module.exports = function (wagner, api, Config) {
    
    api.post('/authenticate', wagner.invoke(function (User) {
        return function (req, res) {
            User.findOne({'username' : req.body.username })
                .exec(function (error, user) {
                    if (error) {
                        return res.
                            status(status.INTERNAL_SERVER_ERROR).
                            json({ error: error.toString()});
                    }
                    if (!user) {
                        return res.json({ success: false, message: 'Authentication failed. User not found.' });
                    }

                    if (user.password != req.body.password) {
                        return res.json({ success: false, message: 'Authentication failed. Login incorrect' });
                    }

                    var token = jwt.sign(user.attributes, Config.secret);

                    res.header('Authorization', token);
                    res.header("x-access-token", token);

                    return res.json({
                        success: status.OK,
                        message: 'Enjoy your token!',
                        token: token
                    });
                });
        };
    }));

    api.get('/verifyJWT', verifyJWT, function (req, res) {
        return res.status(status.OK).json({success: status.OK, });
    });

    return api;
};
