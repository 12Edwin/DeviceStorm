const {Router} = require("express");
const {validateError, validateMiddlewares} = require("../../util/functions");
const Sale = require('./Sale');
const Book = require('../book/Book');
const {validateJWT, validateIdRequest, validateBook, status, validateEmail, validateBookBought} = require("../../helpers/db-validations");
const {check} = require("express-validator");

const getAll = async (req, res = Response) =>{
    try {
        const query = req.query;
        const [sales, total] = await Promise.all([
            Sale.find(query),
            Sale.countDocuments()
        ]);

        res.status(200).json({total, sales});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const getById = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const sale = await Sale.findById(id);

        res.status(200).json(sale);
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const getByEmail = async (req, res = Response) =>{
    try {
        const {email} = req.params;
        const response = await Sale.aggregate([
                {
                    $match: {
                        email: email,
                    }
                }
            ], (err, results) =>{
                if (err){
                    console.log(err)
                }else {
                }
            }
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
        const {book,email,price,pay} = req.body;
        const created = new Date().toISOString().split('T')[0];
        const sale = await new Sale({book,email,price,status:true,created,pay})
        await sale.save();
        await Book.updateOne({name:book},{status:false});

        res.status(200).json({msg:'Successful request', sale});
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
        const [updated, sale] = await Promise.all([
            Sale.findByIdAndUpdate(id,{status}),
            Sale.findById(id)
        ]);

        res.status(200).json({msg:'Successful request', sale, status});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const deletes = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const saleOpt = await Sale.findById(id);
        const [updated, sale] = await Promise.all([
            Sale.findByIdAndUpdate(id,{status:false}),
            Book.findOneAndUpdate({name: saleOpt.book},{status:true})
        ]);

        res.status(200).json({msg:'Successful request', sale, status});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const saleRouter = Router();

saleRouter.get('/',[
    validateJWT
],getAll);

saleRouter.get('/:id',[
    validateJWT,
    check('id','El id no es de mongo').isMongoId(),
    validateMiddlewares
],getById);

saleRouter.get('/email/:email',[
    validateJWT,
    check('email','Correo inválido').isEmail(),
    validateMiddlewares
],getByEmail);

saleRouter.post('/',[
    validateJWT,
    check('book','Título del libro necesario').not().isEmpty(),
    check('book').custom(validateBook),
    check('book').custom(validateBookBought),
    check('email','El correo es necesario').not().isEmpty(),
    check('email','Correo inválido').isEmail(),
    validateMiddlewares
],insert);

saleRouter.put('/:id',[
    validateJWT,
    check('id','El id no es de mongo').isMongoId(),
    check('status').custom(status),
    validateMiddlewares
],update);

saleRouter.delete('/:id',[
    validateJWT,
    check('id','No es un id correcto').isMongoId(),
    validateMiddlewares
],deletes);

//requestRouter.delete('/:id',[],deletes);

module.exports ={ saleRouter }