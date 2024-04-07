const express = require('express')
const router = express.Router()
const {apiKey, permission} = require('../auth/checkAuth')

router.use(apiKey)
router.use(permission('0000'))
router.use('/v1/api', require('./access'))




module.exports = router