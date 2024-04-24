
const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError } = require('../core/error.message')

const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'

}
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //accessToken
        console.log({ publicKey, privateKey })
        const accessToken = await JWT.sign(payload, publicKey, {

            expiresIn: '2 days'
        })
        const refreshToken = await JWT.sign(payload, privateKey, {

            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err)
            } else {
                console.log(`decode verify:: `, decode)
            }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        console.error('Error creating token pair:', error);
        throw error; // Re-throw lỗi để nó được xử lý ở nơi gọi
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
    1-Check userId missing
    2-get Accesstoken
    3-verifyToken
    4-check user in dbs
    5-check keyStore with this userId
    6-Oke all => return next
    */

    const userId = req.headers[HEADER.CLIENT_ID]
    console.log(userId)
    if (!userId) throw new AuthFailureError("Invalid Request");

    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new AuthFailureError('Not found KeyStore')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid Request AT')
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid Userid')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw new err;
    }
})

module.exports = {
    createTokenPair,
    authentication
}