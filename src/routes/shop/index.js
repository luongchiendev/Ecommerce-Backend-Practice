const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/product.controller');

// Tạo sản phẩm mới
router.post('/products/create', ProductController.createProduct);

// Cập nhật sản phẩm
router.put('/products/update/:id', ProductController.updateProduct);

// Xoá sản phẩm
router.delete('/products/delete/:id', ProductController.deleteProduct);

// Lấy sản phẩm theo ID
router.get('/products/:id', ProductController.getProductById);

// Lấy danh sách sản phẩm
router.get('/product/getall', ProductController.getAllProduct);

// Tìm kiếm sản phẩm
router.get('/products/search', ProductController.searchProducts);

// Lọc sản phẩm
router.get('/products/filter', ProductController.filterProducts);

module.exports = router;
