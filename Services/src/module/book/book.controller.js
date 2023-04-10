const {Router} = require("express");
const {validateError, validateMiddlewares} = require("../../util/functions");
const Book = require ('./Book');
const {check} = require("express-validator");
const {validateJWT, validateIdBook, existBook} = require("../../helpers/db-validations");
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const getAll = async (req, res = Response) =>{
    try {
        const query = req.query;
        const [total, books] = await Promise.all([
            Book.countDocuments(),
            Book.find(query)
        ]);

        res.status(200).json({total, books});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const getById = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const book = await Book.findById(id);

        res.status(200).json({msg:'Successful request',book});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const insert = async (req, res = Response) =>{
    try {
        const {name, author, publication, resume, category, price} = req.body;
        const book = await new Book({name, author, publication, resume, category, price, status:true});
        await book.save();

        res.status(200).json({message:'Successful request', book});
    }catch (error){
        const  message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const update = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const book = req.body;
        await Book.findByIdAndUpdate(id,book);

        res.status(200).json({msg:'Successful request', book});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const deletes = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const book = await Book.findById(id);
        await Book.findByIdAndUpdate(id,{status:!book.status});

        res.status(200).json(book.status ?{msg:'Book deleted'}: {msg: 'Book restored'});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

const uploadImage = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const { filename } = req.file;
        const image = { img : `${filename}` };
        await Book.findByIdAndUpdate(id,image);
        res.json({msg: 'Successful request' , image });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Error uploading image' });
    }
}

const getImage = async (req, res ) =>{
    const {filename} = req.params;
    const path = `uploads/${filename}`;

    if (!fs.existsSync(path)) {
        res.status(404).send({msg:'Archivo no encontrado'});
        return;
    }

    // Crear un flujo de lectura del archivo
    const stream = fs.createReadStream(path);

    // Configurar los encabezados de la respuesta HTTP
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    // Enviar el flujo de lectura como respuesta de transmisión
    stream.pipe(res);
}

const bookRouter = Router();

bookRouter.get('/',[
validateJWT,
],getAll);

bookRouter.get('/:id',[
    validateJWT,
    check('id','El id no pertenece a mongo').isMongoId(),
    check('id').custom(validateIdBook),
    validateMiddlewares
],getById);

bookRouter.post('/',[
    validateJWT,
    check('name', 'El titulo del libro es obligatorio').not().isEmpty(),
    check('name').custom(existBook),
    check('author', 'El autor del libro es obligatorio').not().isEmpty(),
    check('publication', 'La fecha de publicación es obligatoria').not().isEmpty(),
    check('publication').trim().isDate().withMessage('Must be a valid date'),
    check('price').not().isEmpty().withMessage('El precio es obligatorio'),
    validateMiddlewares
],insert);

bookRouter.put('/:id',[
    validateJWT,
    check('publication').optional().isDate().withMessage('Must be a valid date'),
    check('id','El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdBook),
    validateMiddlewares
],update);

bookRouter.put('/image/:id',[
    validateJWT,
    check('id','El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdBook),
    upload.single('image'),
    validateMiddlewares
],uploadImage);

bookRouter.get('/image/:filename',[],getImage);

bookRouter.delete('/:id',[
    validateJWT,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdBook),
    validateMiddlewares
],deletes);

module.exports = {
    bookRouter
};