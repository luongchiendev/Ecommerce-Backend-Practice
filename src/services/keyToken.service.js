
const keyTokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')
class keyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {


        //lv ex
        try {
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert: true, new: true }

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null

        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        try {
            // Kiểm tra tính hợp lệ của userId
            if (!Types.ObjectId.isValid(userId)) {
                throw new Error('Invalid userId');
            }

            // Truy vấn cơ sở dữ liệu và trả về kết quả
            const result = await keyTokenModel.findOne({ user: userId }).lean();
            return result;
        } catch (error) {
            console.error(error);
            throw error; // Re-throw lỗi để nó được xử lý ở nơi gọi
        }
    }
    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne(id);
    }

}
module.exports = keyTokenService