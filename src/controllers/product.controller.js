
const ProductService = require("../services/product.service");




const productModel = require("../models/product.model");

class ProductController {

    createProduct = async (req, res, next) => {
        try {
            console.log(`[P]::CreateProduct::`, req.body)
            return res.status(201).json(await ProductService.createNewProduct(req.body))
        } catch (error) {
            next(error);
        }
    }



}




module.exports = new ProductController()