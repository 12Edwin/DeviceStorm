const {Router} = require("express");
const {validateError, validateMiddlewares} = require("../../util/functions");
const Request = require('./Request');
const {validateJWT, validateIdRequest, validateBook, status, validateEmail, validateBookBought} = require("../../helpers/db-validations");
const {check} = require("express-validator");

const getAll = async (req, res = Response) =>{
    try {
        const query = req.query;
        const [requests, total] = await Promise.all([
            Request.find(query),
            Request.countDocuments()
        ]);

        res.status(200).json({total, requests});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const getById = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const request = await Request.findById(id);

        res.status(200).json(request);
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const getByEmail = async (req, res = Response) =>{
    try {
        const {email} = req.params;
        const response = await Request.aggregate([
            {
                $match: {
                    email: email,
                    }
            }
        ]
        );

        res.status(200).json(response);
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const insert = async (req, res = Response) =>{
    try {
        const {book,email,returns} = req.body;
        const created = new Date().toISOString().split('T')[0];
        const request = await new Request({book,email,returns,status:'Pending',created})

        await request.save();
        res.status(200).json({msg:'Successful request', request});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}
const update = async (req, res = Response) =>{
    try {
        const {status} = req.body;
        const {id} = req.params;
        const [updated, request] = await Promise.all([
            Request.findByIdAndUpdate(id,{status}),
            Request.findById(id)
        ]);

        res.status(200).json({msg:'Successful request', request, status});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const requestRouter = Router();

requestRouter.get('/',[
    validateJWT
],getAll);

requestRouter.get('/:id',[
    validateJWT,
    check('id','El id no es de mongo').isMongoId(),
    check('id').custom(validateIdRequest),
    validateMiddlewares
],getById);

requestRouter.get('/email/:email',[
    validateJWT,
    check('email','Correo inválido').isEmail(),
    validateMiddlewares
],getByEmail);

requestRouter.post('/',[
    validateJWT,
    check('book','Título del libro necesario').not().isEmpty(),
    check('book').custom(validateBook),
    check('book').custom(validateBookBought),
    check('email','El correo es necesario').not().isEmpty(),
    check('email','Correo inválido').isEmail(),
    check('returns','Fecha de retorno necesaria').not().isEmpty(),
    check('returns').trim().isDate().withMessage('Fecha no válida'),
    validateMiddlewares
],insert);

requestRouter.put('/:id',[
    validateJWT,
    check('id','El id no es de mongo').isMongoId(),
    check('id').custom(validateIdRequest),
    check('status').custom(status),
    validateMiddlewares
],update);

//requestRouter.delete('/:id',[],deletes);

module.exports ={ requestRouter }