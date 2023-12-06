const {Router} = require("express");
const Place = require('./Place');
const {validateError, validateMiddlewares} = require("../../util/functions");
const {validateJWT, validateIdPlace, validateIdCategory} = require("../../helpers/db-validations");
const {check} = require("express-validator");
const Category = require("../category/Category");

const getAll = async (req, res= Response) =>{
    try {
        const query = req.query;
        const [places,total] = await Promise.all([
            Place.find(query),
            Place.countDocuments(query)
        ]);
        res.status(200).json({msg:'Successful request', total, places});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const getById = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        const place = await Place.findById(id);

        res.status(200).json({msg:'Successful request', place});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const insert = async (req, res= Response) =>{
    try {
        const {name, direction, capacity} = req.body
        const created_at = new Date();

        const place = await new Place({name, direction, capacity, created_at, status: true });
        await place.save();

        res.status(200).json({msg:'Successful request', place});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const update = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const place = req.body;
        await Place.findByIdAndUpdate(id,place);

        res.status(200).json({msg:'Successful request', place});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const deletes = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        const place = await Place.findById(id)
        const result = await Place.findByIdAndUpdate(id, {status: !place.status});

        res.status(200).json({msg:'Status deleted'});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const placeRouter = Router();

placeRouter.get('/',[
    validateJWT
],getAll);

placeRouter.get('/:id',[
    validateJWT,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdPlace),
    validateMiddlewares
],getById);

placeRouter.post('/',[
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('direction').not().isEmpty().withMessage('Direction is required'),
    check('capacity').not().isEmpty().withMessage('Capacity is required'),
    check('capacity').isNumeric().withMessage('Capacity must be number'),
    validateMiddlewares
], insert);

placeRouter.put('/:id',[
    validateJWT,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdPlace),
    check('name', 'Name is required').not().isEmpty(),
    check('direction').not().isEmpty().withMessage('Direction is required'),
    check('capacity').not().isEmpty().withMessage('Capacity is required'),
    check('capacity').isNumeric().withMessage('Capacity must be number'),
    validateMiddlewares
], update);

placeRouter.delete('/:id',[
    validateJWT,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdPlace),
    validateMiddlewares
],deletes);

module.exports = { placeRouter }
