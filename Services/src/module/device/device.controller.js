const {Router} = require("express");
const {validateError, validateMiddlewares} = require("../../util/functions");
const Device = require ('./Device');
const {check} = require("express-validator");
const {validateJWT, validateIdDevice, existDevice, validateIdPlace, validateIdSupplier, validateIdCategory} = require("../../helpers/db-validations");
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const getAll = async (req, res = Response) =>{
    try {
        const query = req.query;
        const [total, devices ] = await Promise.all([
            Device.countDocuments(),
            Device.find(query)
        ]);

        res.status(200).json({total, devices});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const getById = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const device = await Device.findById(id);

        res.status(200).json({msg:'Successful request',device});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const insert = async (req, res = Response) =>{
    try {
        const {name, code, place, supplier, category, stock} = req.body;
        const created_at = new Date();
        const device = await new Device({name, code, place, supplier, category, stock, created_at, available:true});
        await device.save();

        res.status(200).json({message:'Successful request', device});
    }catch (error){
        const  message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const update = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const device = req.body;
        await Device.findByIdAndUpdate(id,device);

        res.status(200).json({msg:'Successful request', device});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const deletes = async (req, res = Response) =>{
    try {
        const {id} = req.params;
        const device = await Device.findById(id);
        await Device.findByIdAndUpdate(id,{status:!device.status});

        res.status(200).json(device.status ?{msg:'device deleted'}: {msg: 'device restored'});
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
        await Device.findByIdAndUpdate(id,image);
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

const deviceRouter = Router();

deviceRouter.get('/',[
validateJWT,
],getAll);

deviceRouter.get('/:id',[
    validateJWT,
    check('id','El id no pertenece a mongo').isMongoId(),
    check('id').custom(validateIdDevice),
    validateMiddlewares
],getById);

deviceRouter.post('/',[
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('name').custom(existDevice),
    check('code').isString().not().isEmpty().withMessage('Code is required'),
    check('place').not().isEmpty().withMessage('Place is required'),
    check('place').isMongoId().withMessage('Invalid place'),
    check('place').custom(validateIdPlace).withMessage('Invalid place'),
    check('supplier', 'Supplier is required').not().isEmpty(),
    check('supplier').isMongoId().withMessage('Invalid supplier'),
    check('supplier').custom(validateIdSupplier).withMessage('Invalid supplier'),
    check('category').not().isEmpty().withMessage('Category is required'),
    check('category').isMongoId().withMessage('Invalid category'),
    check('category').custom(validateIdCategory).withMessage('Invalid category'),
    check('stock').not().isEmpty().withMessage('Stock is required'),
    check('stock').isNumeric().withMessage('Stock must be numeric'),
    validateMiddlewares
],insert);

deviceRouter.put('/:id',[
    validateJWT,
    check('publication').optional().isDate().withMessage('Must be a valid date'),
    check('id','El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdDevice),
    validateMiddlewares
],update);

deviceRouter.put('/image/:id',[
    validateJWT,
    check('id','El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdDevice),
    upload.single('image'),
    validateMiddlewares
],uploadImage);

deviceRouter.get('/image/:filename',[],getImage);

deviceRouter.delete('/:id',[
    validateJWT,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('id').custom(validateIdDevice),
    validateMiddlewares
],deletes);

module.exports = {
    deviceRouter
};