//!dmbg
const { model, Schema, Types } = require('mongoose'); // Erase if already required


const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_id: { type: String, required: true },
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});



//Export the model
module.exports = (model(DOCUMENT_NAME, productSchema))
