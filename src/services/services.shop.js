const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const keyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
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
            if (!newShop) {
                return {
                    code: 500, // Internal Server Error
                    message: 'Failed to create new shop'
                };
            }

            // Return success response
            return {
                code: 201, // Created
                metadata: {
                    shop: newShop
                }
            };
        } catch (error) {
            return {
                code: 500,
                message: error.message
            };
        }
    }
}
module.exports = AccessService;
