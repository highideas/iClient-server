var status = require('http-status');
var jwt    = require('jsonwebtoken');

module.exports = function (wagner, api) {
    
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
                        return res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                    }
                    
                    var token = jwt.sign(user, api.get('superSecret'), {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });
                    // return the information including token as JSON
                    return res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                });
        };
    }));

    return api;
};
