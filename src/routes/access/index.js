const express = require('express')

const accessController = require('../../controllers/access.controller')
const { authentication } = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()



// signUp
router.post('/shop/signup', accessController.signUp)
router.post('/shop/login', accessController.logIn)
router.get('/shop/verify', accessController.verify)

//authentication
router.use(authentication)

router.post('/shop/logout', asyncHandler(accessController.logout))


module.exports = router