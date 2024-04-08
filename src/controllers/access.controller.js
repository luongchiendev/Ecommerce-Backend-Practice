const AccesService = require("../services/services.shop");

class AccessController{

    signUp = async ( req, res, next) =>{
        try{
            console.log(`[P]::signUp::`, req.body)
           return res.status(201).json(await AccesService.signUp(req.body))
        }catch(error){
            next(error);
        }
    }

    logIn = async (req, res, next) =>{
        try{
            console.log(`[P]LogIn::: `, req.body)
            return res.status(201).json(await AccesService.logIn(req.body))
        }catch(error){
            next(error)
        }
    }

    

}

module.exports = new AccessController()