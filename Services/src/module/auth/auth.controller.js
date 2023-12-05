const {Router} = require ("express");
const {validateError, validateMiddlewares, validatePassword} = require ("../../util/functions");
const {check} = require("express-validator");
const User = require ('../user/User')
const {generateJWT, validateToken} = require("../../config/jwt");


const login = async (req, res = Response) =>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({msg:'Usuario / Contraseña invalidos'});
        }
        if(!user.status){
            return res.status(401).json({msg:'Usuario / Contraseña invalidos'});
        }

        const validPassword = await validatePassword(password, user.password);
        if(!validPassword)
            return res.status(401).json({msg:'Usuario / Contraseña invalidos'});

        const token = await generateJWT(user.id);

        res.status(200).json({user,token});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const refresh = async (req, res = Response) =>{
    try {
        const {token} = req.body;
        const result = validateToken(token);
        res.status(200).json(result);
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log((error));
    }
}

const authRouter = Router();
authRouter.post('/login',[
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateMiddlewares
],login);
authRouter.post('/refresh', [
    check('token').not().isEmpty().withMessage('El token es necesario'),
    validateMiddlewares
], refresh)

module.exports = {
    authRouter
}