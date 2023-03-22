const {Router} = require("express");
const Category = require('../category/Category');
const {validateError, validateMiddlewares} = require("../../util/functions");
const {validateJWT, validateIdCategory} = require("../../helpers/db-validations");
const {check} = require("express-validator");

const getAll = async (req, res= Response) =>{
    try {
        const query = req.query;
        const [category,total] = await Promise.all([
            Category.find(query),
            Category.countDocuments(query)
        ]);

        res.status(200).json({msg:'Successful request', total, category});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const getById = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        const category = await Category.findById(id);

        res.status(200).json({msg:'Successful request',category});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const insert = async (req, res= Response) =>{
    try {
        const {name,description, gender} = req.body
        const category = await new Category({name, description, gender});
        await category.save();

        res.status(200).json({msg:'Successful request',category});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const deletes = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        await Category.findByIdAndDelete(id);

        res.status(200).json({msg:'Status deleted'});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const categoryRouter = Router();

categoryRouter.get('/',[
    validateJWT
],getAll);

categoryRouter.get('/:id',[
    validateJWT,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdCategory),
    validateMiddlewares
],getById);

categoryRouter.post('/',[
    validateJWT,
    check('name', 'El nombre del status es obligatorio').not().isEmpty(),
    check('gender').not().isEmpty().withMessage('Género obligatorio'),
    validateMiddlewares
], insert);

categoryRouter.delete('/:id',[
    validateJWT,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdCategory),
    validateMiddlewares
],deletes);

module.exports = { categoryRouter }
