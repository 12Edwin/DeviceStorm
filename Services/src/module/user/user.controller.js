const {Response, Router} = require('express');
const {validateError, hashPassword, validateMiddlewares} = require("../../util/functions");
const User = require('./User');
const {check} = require("express-validator");
const {validateEmail, validateId, validateJWT, validateAdmin, roles} = require("../../helpers/db-validations");

const getAll = async  (req, res = Response) =>{
    try {
        const query = req.query;
        const [total, users] = await Promise.all([
            User.countDocuments(),
            User.find(query)
        ]);

        res.status(200).json({total, users});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}
const getById = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json({msg:'Successful request',user});

    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}
const insert = async (req, res = Response) =>{
    try {

        const {name,surname, lastname, email,career,role,password} = req.body;
        const user = new User ({name,surname, lastname, email,career,role, password, status:true});
        user.password = await hashPassword(password);
        await user.save();
        res.status(200).json({message:'Successful request',user});
    }catch (error){
        const message = validateError(error);
        res.status(400).json({Error:message});
        console.log(error);
    }
}

const update = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const {email, password, ... rest} = req.body;
        if (password){
            rest.password = await hashPassword(password);
        }
        const user = await User.findByIdAndUpdate(id , rest);
        res.status(200).json({Message:'Successful request', user});

    }catch (error){
        const message = validateError(error);
        res.status(400).json({Error:message});
        console.log(error);
    }
}

const deletes = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        const status = !user.status;
        const result = await User.findByIdAndUpdate(id, {status})
        res.status(200).json(user.status ?{result_delete: 'Successful'}:{restored: 'Successful'});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const userRouter = Router()

userRouter.get('/',[
    validateJWT,
    //validateAdmin
],getAll);
userRouter.get('/:id',[
    validateJWT,
    check('id').custom(validateId),
    validateMiddlewares
],getById);
userRouter.put('/:id',[
    validateJWT,
    check('id','Id inválido para mongo').isMongoId(),
    check('id').custom(validateId),
    check('email').optional().isEmail().withMessage('Correo inválido').custom(validateEmail),
    check('password').optional().isLength({min:6}).withMessage('Su contraseña debe contener más de 6 caracteres'),
    validateMiddlewares
],update);
userRouter.post('/',[
    //validateJWT,
    check('email','Correo inválido').isEmail(),
    check('email').custom(validateEmail),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastname', 'El apellido paterno es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe contener más de 6 caracteres').isLength({min:6}),
    check('role').custom(roles),
    validateMiddlewares
],insert);
userRouter.delete('/:id',[
    validateJWT,
    check('id','Id inválido para mongo').isMongoId(),
    check('id').custom(validateId),
    validateMiddlewares
],deletes);

module.exports= {
    userRouter
}