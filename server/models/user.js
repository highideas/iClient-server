var mongoose = require('mongoose');

var userSchema = {
    username : {
        type: String,
        required: true,
        lowercase: true
    },
    email : {
        type: String,
        required: true,
        index: { unique: true },
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password : {
        type: String,
        required: true
    }
};

module.exports = new mongoose.Schema(userSchema, { timestamps : true});
module.exports.userSchema = userSchema;
