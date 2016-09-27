var mongoose = require('mongoose');

var areaSchema = {
    _id: {
        type: String,
        required: true
    },
    parent: {
        type: String,
        ref: 'Area'
    },
    ancestors: [{
        type: String,
        ref: 'Area'
    }]
};

module.exports = new mongoose.Schema(areaSchema);
module.exports.areaSchema = areaSchema;
