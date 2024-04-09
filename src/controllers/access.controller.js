const { response } = require("express");
const AccesService = require("../services/services.shop");

class AccessController {






    // signUp = async (req, res, next) => {
    //     try {
    //         console.log(`[P]::signUp::`, req.body)
    //         return res.status(201).json(await AccesService.signUp(req.body))
    //     } catch (error) {
    //         next(error);
    //     }
    // }

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

    logIn = async (req, res, next) => {
        try {
            console.log(`[P]LogIn::: `, req.body)
            return res.status(201).json(await AccesService.logIn(req.body))
        } catch (error) {
            next(error)
        }
    }

    logIn = async (req, res) => {
        try {
            const { email, password } = req.body
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
            return res.status(200).json({ ...newReponse, refresh_token })
        } catch (e) {
            return res.status(400).json({
                message: e
            })
        }
    }



}

module.exports = new AccessController()