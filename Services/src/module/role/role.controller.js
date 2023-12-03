const {Router} = require("express");
const Role = require('./Role');
const {validateError, validateMiddlewares} = require("../../util/functions");
const {validateJWT, validateIdRole} = require("../../helpers/db-validations");
const {check} = require("express-validator");

const getAll = async (req, res= Response) =>{
    try {
        const query = req.query;
        const [roles,total] = await Promise.all([
            Role.find(query),
            Role.countDocuments()
        ]);

        res.status(200).json({msg:'Successful request', total, roles});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const getById = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        const role = await Role.findById(id);

        res.status(200).json({role});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const insert = async (req, res= Response) =>{
    try {
        const {name,description} = req.body
        const role = await new Role({name, description});
        await role.save();

        res.status(200).json({msg:'Successful request',role});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const deletes = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        await Role.findByIdAndDelete(id);

        res.status(200).json({msg:'Role deleted'});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const roleRouter = Router();

roleRouter.get('/',[
    validateJWT
],getAll);

roleRouter.get('/:id',[
    validateJWT,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdRole),
    validateMiddlewares
],getById);

roleRouter.post('/',[
    validateJWT,
    check('name', 'El nombre del rol es obligatorio').not().isEmpty(),
    validateMiddlewares
], insert);

roleRouter.delete('/:id',[
    validateJWT,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdRole),
    validateMiddlewares
],deletes);

module.exports = { roleRouter }
