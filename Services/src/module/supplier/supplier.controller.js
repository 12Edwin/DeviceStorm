const {Router} = require("express");
const Supplier = require('./Supplier');
const {validateError, validateMiddlewares} = require("../../util/functions");
const {validateJWT, validateIdSupplier, thereSameSupplier} = require("../../helpers/db-validations");
const {check} = require("express-validator");

const getAll = async (req, res= Response) =>{
    try {
        const query = req.query;
        const [suppliers,total] = await Promise.all([
            Supplier.find(query),
            Supplier.countDocuments(query)
        ]);

        res.status(200).json({msg:'Successful request', total, suppliers});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const getById = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        const supplier = await Supplier.findById(id);

        res.status(200).json({msg:'Successful request', supplier});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const insert = async (req, res= Response) =>{
    try {
        const {name, direction, contact} = req.body
        const created_at = new Date()
        const supplier = await new Supplier({name, direction, contact, created_at, status: true});
        await supplier.save();

        res.status(200).json({msg:'Successful request', supplier});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const update = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const supplier = req.body;
        await thereSameSupplier(supplier.name, id)
        await Supplier.findByIdAndUpdate(id,supplier);

        res.status(200).json({msg:'Successful request', supplier});
    }catch (error){
        if (error.toString().includes('Already exists') ){
            res.status(400).json({msg: 'Already exists'})
        }else{
            res.status(500).json(error);
            console.log(error);
        }
    }
}

const deletes = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        const supplier = await Supplier.findById(id)
        await Supplier.findByIdAndUpdate(id, {status: !supplier.status});

        res.status(200).json({msg:'Status deleted'});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const supplierRouter = Router();

supplierRouter.get('/',[
    validateJWT
],getAll);

supplierRouter.get('/:id',[
    validateJWT,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(validateIdSupplier),
    validateMiddlewares
],getById);

supplierRouter.post('/',[
    validateJWT,
    check('name', 'Missing fields').not().isEmpty(),
    check('direction').not().isEmpty().withMessage('Missing fields'),
    check('contact').not().isEmpty().withMessage('Missing fields'),
    check('contact').isMobilePhone('es-MX').withMessage('Invalid fields'),
    check('name').custom((name)=> thereSameSupplier(name)),
    validateMiddlewares
], insert);

supplierRouter.put('/:id',[
    validateJWT,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(validateIdSupplier),
    check('name', 'Missing fields').not().isEmpty(),
    check('direction').not().isEmpty().withMessage('Missing fields'),
    check('contact').isMobilePhone('es-MX').withMessage('Invalid fields'),
    check('contact').isNumeric().withMessage('Invalid fields'),
    validateMiddlewares
], update);

supplierRouter.delete('/:id',[
    validateJWT,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(validateIdSupplier),
    validateMiddlewares
],deletes);

module.exports = { supplierRouter }
