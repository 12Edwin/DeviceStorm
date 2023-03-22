const {Router} = require("express");
const Status = require('../status/Status');
const {validateError, validateMiddlewares} = require("../../util/functions");
const {validateJWT, validateIdStatus} = require("../../helpers/db-validations");
const {check} = require("express-validator");

const getAll = async (req, res= Response) =>{
    try {
        const query = req.query;
        const [status,total] = await Promise.all([
            Status.find(query),
            Status.countDocuments(query)
        ]);

        res.status(200).json({msg:'Successful request', total, status});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const getById = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        const status = await Status.findById(id);

        res.status(200).json({msg:'Successful request',status});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const insert = async (req, res= Response) =>{
    try {
        const {name,description} = req.body
        const status = await new Status({name, description});
        await status.save();

        res.status(200).json({msg:'Successful request',status});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const deletes = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        await Status.findByIdAndDelete(id);

        res.status(200).json({msg:'Status deleted'});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const statusRouter = Router();

statusRouter.get('/',[
    validateJWT
],getAll);

statusRouter.get('/:id',[
    validateJWT,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdStatus),
    validateMiddlewares
],getById);

statusRouter.post('/',[
    validateJWT,
    check('name', 'El nombre del status es obligatorio').not().isEmpty(),
    validateMiddlewares
], insert);

statusRouter.delete('/:id',[
    validateJWT,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdStatus),
    validateMiddlewares
],deletes);

module.exports = { statusRouter }
