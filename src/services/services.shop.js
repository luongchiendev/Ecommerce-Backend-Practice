const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const { createTokenPair } = require('../auth/authUtils');
const crypto = require('crypto');
const keyTokenService = require('./keyToken.service'); // Import keyTokenService
const { findByEmail } = require('../utils/findEmail');
const { sendVerificationEmail } = require('../utils/sendVerifyEmail');
const { BadRequestError } = require('../core/error.message');

const ROLESHOP = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {


    static logout = async (keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id)
        console.log({ delKey })
        return delKey
    }
    /*
    -------Login Service------
    1. Check Email
    2. Check match password
    3. Create AccessToken và RefreshToken
    4. generate Token
    5. get data return to login
    
    */

    static logIn = async ({ email, password }) => {
        try {
            //1.check email
            const foundShop = await findByEmail({ email })
            if (!foundShop) throw new Error('Shop not found!')
            //2.check match password
            const passwordMatch = await bcrypt.compare(password, foundShop.password)
            if (!passwordMatch) throw new Error('Password not match!')

            const isVerified = await shopModel.findOne({ verify: true })
            if (isVerified) {
                //3. create AT và RT
                const publicKey = crypto.randomBytes(64).toString('hex')
                const privateKey = crypto.randomBytes(64).toString('hex')
                //4.generate token
                const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)
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
                            _id: foundShop._id,
                            name: foundShop.name,
                            email: foundShop.email,
                            isVerified: foundShop.verify
                        },
                        tokens,

                    }
                }
            }


        } catch (error) {

            console.log("error", error.message)
        }


    }



    static signUp = async ({ name, email, password }) => {
        try {
            const holderShop = await shopModel.findOne({ email });
            if (holderShop) {
                throw new BadRequestError('Error: Shop Already Registered!')
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
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')


                console.log({ privateKey, publicKey }); // Save collection KeyStore

                const keyStore = await keyTokenService.createKeyToken({ // Call createKeyToken from keyTokenService
                    userId: newShop._id,
                    publicKey,
                    privateKey
                });

                if (!keyStore) {
                    return {
                        code: "XXXX",
                        message: 'publicKeyString error'
                    }
                }
                console.log(`Key Store: `, keyStore)
                const tokens = await createTokenPair({ userId: newShop._id, email }, keyStore, privateKey); // Fix typo

                console.log(`Created Token Success:: `, tokens);
                //Send email 

                // const MailSended = await sendVerificationEmail(email);
                // if (MailSended) {
                //     return {
                //         code: 200,
                //         message: "Send mail verify!"
                //     }
                // }
                // Return success response
                return {
                    code: 201, // Created
                    metadata: {
                        shop: {
                            _id: newShop._id,
                            name: newShop.name,
                            email: newShop.email
                        },
                        tokens
                    }
                }
            }
            return {
                code: "202",
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
