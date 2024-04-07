
const keyTokenModel = require('../models/keytoken.model')

class keyTokenService{
    static createKeyToken = async ({userId, publicKey}) => {
        try{
            const publicKeyString = publicKey.toString()
            const tokens = await keyTokenModel.create({
                user: userId,
                publicKey: publicKeyString
            })

            
            return tokens ? tokens.publicKey : null
        }catch(error){
            return error
        }
    }
}
module.exports = keyTokenService