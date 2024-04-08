const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const { createTokenPair } = require('../auth/authUtils');
const crypto = require('crypto');
const { generateKeyPairSync } = require('crypto');
const keyTokenService = require('./keyToken.service'); // Import keyTokenService
const {findByEmail} = require('../utils/findEmail')
const ROLESHOP = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
/*
-------Login Service------
1. Check Email
2. Check match password
3. Create AccessToken và RefreshToken
4. generate Token
5. get data return to login

*/

    static logIn = async ({email, password, refreshToken}) => {
        try{
            //1.check email
            const foundShop = await findByEmail({email})
            if(!foundShop) throw new Error('Shop not found!')
            //2.check match password
            const passwordMatch = await bcrypt.compare(password, foundShop.password)
            if(!passwordMatch) throw new Error('Password not match!')
            //3. create AT và RT
            const publicKey = crypto.randomBytes(64).toString('hex')
            const privateKey = crypto.randomBytes(64).toString('hex')
            //4.generate token
            const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey)
            //5.get data return to login
            await keyTokenService.createKeyToken({
                userId: foundShop,
                refreshToken: tokens.refreshToken,
                privateKey, publicKey
            })

            return {
                code: 201, // Created
                metadata: {
                    foundShop: {
                        _id : foundShop._id,
                        name: foundShop.name,
                        email: foundShop.email
                    },
                    
                }
            }
        }catch(error){
            console.log("error", error.message)
        }
        
        // const {privateKey, publicKey} = 
    }



    static signUp = async ({ name, email, password }) => {
        try {
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    code: 202,
                    message: 'Shop already registered!'
                };
            }

            const hashPassword = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name,
                email,
                password: hashPassword,
                roles: [ROLESHOP.SHOP]
            });

            // Error handling for creating newShop
            if (newShop) {
                const { privateKey, publicKey } = generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                });

                console.log({ privateKey, publicKey }); // Save collection KeyStore

                const publicKeyString = await keyTokenService.createKeyToken({ // Call createKeyToken from keyTokenService
                    userId: newShop._id,
                    publicKey
                });

                if (!publicKeyString) {
                    return {
                        code: "XXXX",
                        message: 'publicKeyString error'
                    }
                }
                const publicKeyObject = crypto.createPublicKey(publicKeyString);

                console.log(`publicKeyObject::`, publicKeyObject);

                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyString, privateKey); // Fix typo

                console.log(`Created Token Success:: `, tokens);

                // Return success response
                return {
                    code: 201, // Created
                    metadata: {
                        shop: {
                            _id : newShop._id,
                            name: newShop.name,
                            email: newShop.email
                        },
                        tokens
                    }
                }
            }
            return {
                code: "200",
                metadata: null
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            };
        }
    }
}
module.exports = AccessService;
