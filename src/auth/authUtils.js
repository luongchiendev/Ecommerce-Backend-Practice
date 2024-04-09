
const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //accessToken
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

module.exports = {
    createTokenPair
}