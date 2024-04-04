
const keyTokenModel = require('../models/keytoken.model')

class keyTokenService{
    static createKeyToken = async ({user, publicKey}) => {
        try{
            const publicKeyString = publicKey.toString()
            const token = await keyTokenModel.create({
                user: useId,
                publicKey: publicKeyString
            })

            return token ? publicKeyString : null
        }catch(error){
            return error
        }
    }
}
module.exports = keyTokenService