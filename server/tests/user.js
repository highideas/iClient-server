var assert = require('assert');
var mongoose = require('mongoose');

var userSchema = require('../models/user');

describe('User Schema Tests', function () {
    var User = mongoose.model('User', userSchema, 'users');

    it('has a username field that\' required string', function () {
        var user = new User({});
        user.validate(function (err) {
            assert.ok(err);

            assert.equal(err.errors['username'].kind, 'required');

            user.username = "Gabriel";
            assert.equal(user.username, "Gabriel");
            done();
        });
    });
    it('has a email field that\' required string', function () {
        var user = new User({});
        user.validate(function (err) {
            assert.ok(err);

            assert.equal(err.errors['email'].kind, 'required');

            user.email = "contato@gabrielgoncalves.com.br";
            assert.equal(user.email, "contato@gabrielgoncalves.com.br");
            done();
        });
    });
    it('has a password field that\' required string', function () {
        var user = new User({});
        user.validate(function (err) {
            assert.ok(err);

            assert.equal(err.errors['password'].kind, 'required');

            user.password = "123456";
            assert.equal(user.password, "123456");
            done();
        });
    });
});

