const express = require('express')

const accessController = require('../../controllers/access.controller')
const { apiKey, permission } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()

router.use(apiKey)
router.use(permission('0000'))

// signUp
router.post('/shop/signup', accessController.signUp)
router.post('/shop/login', accessController.logIn)
router.get('/shop/verify', accessController.verify)

//authentication
router.use(authentication)

router.post('/shop/logout', asyncHandler(accessController.logout))


module.exports = router