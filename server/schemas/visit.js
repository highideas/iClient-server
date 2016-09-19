var mongoose = require("mongoose");
var Client = require("./client");
var User = require("./user");

var Schema = mongoose.Schema;
var Types = Schema.Types;

var visitSchema = {
    client  : {
        type: Types.Object,
        ref:  'Client'
    },
    user    : {
        type: Types.Object,
        ref: 'User'
    },
    visit_date : {
        type : Date,
        required: true
    },
    sales_quantity : {
        type: Number,
        required: true
    },
    value_received : {
        type: Number,
        required: true
    }
};

var schema = new mongoose.Schema(visitSchema);

module.exports = schema;
module.exports.visitSchema = visitSchema;
