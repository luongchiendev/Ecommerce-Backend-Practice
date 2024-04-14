const ProductService = require("../services/product.service");

class ProductController {
    createProduct = async (req, res, next) => {
        try {
            const response = await ProductService.createNewProduct(req.body);
            if (response.code === 201) {
                return res.status(201).json(response);
            }
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    updateProduct = async (req, res) => {
        try {
            const productId = req.params.id
            const data = req.body
            if (!productId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The productId is required'
                })
            }
            const response = await ProductService.updateProduct(productId, data)
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({
                message: e
            })
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const productId = req.params.id
            if (!productId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The productId is required'
                })
            }
            const response = await ProductService.deleteProduct(productId)
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({

                message: "This error is: " + e
            })
        }
    }
    getAllProduct = async (req, res) => {
        try {
            const { limit, page, sort, filter } = req.query;

            const response = await ProductService.getAllProduct(limit, page, sort, filter);

            return res.status(200).json(response);

        } catch (e) {
            return res.status(500).json({
                message: "Error fetching products",
                error: e.message
            });
        }
    }

    getProductById = async (req, res, next) => {
        try {
            const productId = req.params.id;
            // Gọi service để lấy sản phẩm theo ID
            // const response = await ProductService.getProductById(productId);
            // return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    // getProducts = async (req, res, next) => {
    //     try {
    //         // Gọi service để lấy danh sách sản phẩm
    //         // const response = await ProductService.getProducts();
    //         // return res.status(200).json(response);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    searchProducts = async (req, res, next) => {
        try {
            const searchTerm = req.query.searchTerm;
            // Gọi service để tìm kiếm sản phẩm
            // const response = await ProductService.searchProducts(searchTerm);
            // return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    filterProducts = async (req, res, next) => {
        try {
            // Lấy các thông tin cần thiết để lọc sản phẩm từ req.query
            const filterOptions = req.query;
            // Gọi service để lọc sản phẩm
            // const response = await ProductService.filterProducts(filterOptions);
            // return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();
