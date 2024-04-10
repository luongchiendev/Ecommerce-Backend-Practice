const productModel = require('../models/product.model');

class ProductService {
    static createNewProduct = async ({ product_id, product_name, product_thumb, product_description, product_price, product_quantity, product_type }) => {
        try {
            const existProduct = await productModel.findOne({ product_id });
            if (existProduct) {
                return {
                    code: 403,
                    message: "Product is already exists!"
                };
            }

            const newProduct = await productModel.create({
                product_id,
                product_name,
                product_thumb,
                product_description,
                product_price,
                product_quantity,
                product_type
            });

            if (newProduct) {
                return {
                    code: 201,
                    status: "Create new product Success!",
                    data: newProduct
                };
            }

            return {
                code: 200,
                status: "Create done!"
            };
        } catch (error) {
            return {
                code: 403,
                status: "CreateProduct Method has problem!",
                message: error.message
            };
        }
    };
}

module.exports = ProductService;
