const {Router} = require("express");
const Category = require('../category/Category');
const {validateError, validateMiddlewares} = require("../../util/functions");
const {validateJWT, validateIdCategory, status, thereCategoriesInDevices, thereSameCategory} = require("../../helpers/db-validations");
const {check} = require("express-validator");
const User = require("../user/User");

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
        const created_at = new Date()
        const category = await new Category({name, description, created_at, status: true});
        await category.save();

        res.status(200).json({msg:'Successful request',category});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const update = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const category = req.body;
        await Category.findByIdAndUpdate(id,category);

        res.status(200).json({msg:'Successful request', category});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const deletes = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        const category = await Category.findById(id);
        const status = !category.status;
        const result = await Category.findByIdAndUpdate(id, {status})
        res.status(200).json(result ?{result_delete: 'Successful'}:{restored: 'Successful'});
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
    check('description').not().isEmpty().withMessage('Description required'),
    check('name').custom(thereSameCategory),
    validateMiddlewares
], insert);

categoryRouter.put('/:id',[
    validateJWT,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(validateIdCategory),
    check('name', 'Missing fields').not().isEmpty(),
    check('description').not().isEmpty().withMessage('Missing fields'),
    check(['name', 'id']).custom(thereSameCategory),
    validateMiddlewares
], update);

categoryRouter.delete('/:id/:status',[
    validateJWT,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdCategory),
    check('id').custom(thereCategoriesInDevices),
    validateMiddlewares
],deletes);

module.exports = { categoryRouter }
