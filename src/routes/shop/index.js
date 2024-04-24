const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/product.controller');
const { authentication } = require('../../auth/authUtils')
const multer = require('multer');

// Set storage engine
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.use(authentication)
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

//Import File
router.post('/products/import', upload.single('file'), ProductController.fileUpload)
//Export File
router.get('/product/export', ProductController.exportFile)
module.exports = router;
