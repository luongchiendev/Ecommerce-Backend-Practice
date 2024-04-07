const mongoose = require('mongoose')
const {Schema, model, Types} = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMNET_NAME= 'Apikey'
const DOCUMENT_COLLECTIONS = 'Apikeys'
var apiKeyModel = new Schema({
    key:{
        type: String,
        required: true,
        unique: true
    },
    status:{
        type: Boolean, 
        default: true
    },
    permissions:{
        type: [String], 
        require: true,
        enum: ['0000', '1111', '2222']
    }
}, {
    collection: DOCUMENT_COLLECTIONS,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMNET_NAME, apiKeyModel);