const mongoose = require('mongoose')
const {Schema, model} = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMNET_NAME= 'Key'
const DOCUMENT_COLLECTIONS = 'Keys'
var keyTokenSchema = new mongoose.Schema({
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey:{
        type: String, 
        required: true
    },
    privateKey:{
        type: String,
        required: true
    },
    refreshTokensUsed:{
        type: Array, 
        default: []
    },
    refreshToken:{
        type: String,
        required: true
    }
}, {
    collection: DOCUMENT_COLLECTIONS,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMNET_NAME, keyTokenSchema);