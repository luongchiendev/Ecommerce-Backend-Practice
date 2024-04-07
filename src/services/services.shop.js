const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const { createTokenPair } = require('../auth/authUtils');
const crypto = require('crypto');
const { generateKeyPairSync } = require('crypto');
const keyTokenService = require('./keyToken.service'); // Import keyTokenService
const ROLESHOP = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
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
