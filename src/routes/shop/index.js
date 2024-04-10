'use strict'

const express = require('express')

const productController = require('../../controllers/product.controller')
const router = express.Router()

// signUp
router.post('/product/create', productController.createProduct)

module.exports = router