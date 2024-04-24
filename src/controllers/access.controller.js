
const AccesService = require("../services/services.shop");

const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const shopModel = require("../models/shop.model");
const { SuccessResponse } = require('../core/success.message');
const AccessService = require("../services/services.shop");
const { findById } = require("../models/apikey.model");
class AccessController {



    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Success',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }


    // Middleware để xác minh khóa API và quyền truy cập
    // Xác minh token khi người dùng nhấp vào liên kết
    verify = async (req, res, next) => {
        try {
            const verifyToken = req.query.token;

            // Kiểm tra khóa API và quyền truy cập
            if (verifyToken) {
                // Xác minh token
                jwt.verify(verifyToken, process.env.EMAIL_VERIFICATION_SECRET, async (err, decoded) => {
                    if (err) {
                        console.error('Error verifying email token:', err);
                        return res.status(400).json({ message: 'Invalid verification token' });
                    } else {
                        try {
                            // Tìm người dùng cần cập nhật
                            const verifyEmail = await shopModel.findOne({ email: decoded.email });
                            if (verifyEmail) {
                                // Cập nhật trạng thái email đã được xác minh
                                await shopModel.updateOne({ email: decoded.email }, { verify: true });
                                console.log('Email verified successfully.');
                            } else {
                                return res.status(404).json({ message: 'User not found' });
                            }
                            return res.status(200).json({ message: 'Email verified successfully.' });
                        } catch (error) {
                            console.error('Error updating user:', error);
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                    }
                });
            } else {
                return res.status(404).json({ message: 'Verification token not found' });
            }
        } catch (error) {
            next(error);
        }
    };

    signUp = async (req, res, next) => {
        try {
            const { name, email, password } = req.body
            const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            const isCheckEmail = reg.test(email)
            if (!name || !email || !password) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'The input is required'
                })
            } else if (!isCheckEmail) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'The input is email'
                })
            }
            const response = await AccesService.signUp(req.body)
            if (response.code === 202) {
                return res.status(201).json({
                    message: "Shop is created!"
                })
            }
            else {
                return res.status(200).json(response)
            }

        } catch (error) {
            next(error)
        }
    }

    logIn = async (req, res) => {
        try {
            const { email, password } = req.body

            // console.log(apikey)
            const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            const isCheckEmail = reg.test(email)
            if (!email || !password) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is required'
                })
            } else if (!isCheckEmail) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The input is email'
                })
            }
            const response = await AccesService.logIn(req.body)
            const { refresh_token, ...newReponse } = response

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                path: '/',
            })
            // res.cookie('x-api-key', apikey, {
            //     httpOnly: true,
            //     secure: false,
            //     sameSite: 'strict',
            //     path: '/',
            // })
            return res.status(200).json({ ...newReponse, refresh_token })
        } catch (e) {
            return res.status(400).json({
                message: e
            })
        }
    }
}




module.exports = new AccessController()