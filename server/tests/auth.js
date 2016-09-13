var assert = require('assert');
var superagent = require('superagent');
var status = require('http-status');    
var bodyparser = require('body-parser');

var URL_ROOT = 'http://localhost:3001';

module.exports = function (User) {

var User = User;

describe('Auth API', function () {

    beforeEach(function (done) {
        User.remove({}, function (error) {
            assert.ifError(error);
            done();
        });
    });

    beforeEach(function (done) {
        var data = {
            'username' : 'gabriel',
            'email' : 'gabriel@teste.com',
            'password' : '12345678' 
        }
        User.create(data, function (err) {
            assert.ifError(err);
            done();
        });
    });

    it('return all users', function (done) {
        var url = URL_ROOT + '/authenticate';

        superagent.post(url)
            .send({
                'username' : "gabriel",
                'password' : '12345678'
            })
            .end(function (error, res) {
            console.log(error, res);
                assert.ifError(error);
                assert.equal(res.status, status.OK);

                var results;
                assert.doesNotThrow(function (){
                    results = JSON.parse(res.text);
                });

                assert.equal(results.length, 3);
                done();
        });

    });
});

}
