
const keyTokenModel = require('../models/keytoken.model')

class keyTokenService{
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        //lv entry
        // try{
        //     const publicKeyString = publicKey.toString()
        //     const tokens = await keyTokenModel.create({
        //         user: userId,
        //         publicKey: publicKeyString,
        //         privateKey
        //     })

            
        //     return tokens ? tokens.publicKey : null

        //lv ex
        try{
        const filter = {user: userId}, update = {
            publicKey, privateKey, refreshTokensUsed: [], refreshToken
        }, options = {upsert: true, new: true}

        const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

         return tokens ? tokens.publicKey : null

        }catch(error){
            return error
        }
    }
}
module.exports = keyTokenService