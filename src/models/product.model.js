//!dmbg
const { model, Schema, Types } = require('mongoose'); // Erase if already required


const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
var productSchema = new Schema({

    name: { type: String, required: true },
    thumb: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});



//Export the model
module.exports = (model(DOCUMENT_NAME, productSchema))
