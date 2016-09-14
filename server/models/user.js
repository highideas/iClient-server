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

schema = new mongoose.Schema(userSchema, { timestamps : true});

schema.virtual('attributes').get(function(){
    return {
        '_id'       : this._id,
        'username'  : this.username,
        'email'     : this.email
    };
});

schema.set('toObject', {virtuals : true});
schema.set('toJSON', {virtuals: true});


module.exports = schema;
module.exports.userSchema = userSchema;
