var mongoose = require("mongoose");

var clientSchema = {
    name : {
        type: String,
        index: { unique: true },
        required: true,
    },
    telefone : { type: String },
    loc: {
        type: [Number],  // [<longitude>, <latitude>]
        index: "2d"      // create the geospatial index
    },
    address : {
        type: String,
        required: true
    },
    city : {
        type: String,
        required: true
    }
};

module.exports = new mongoose.Schema(clientSchema, { timestamps : true});
module.exports.clientSchema = clientSchema;
