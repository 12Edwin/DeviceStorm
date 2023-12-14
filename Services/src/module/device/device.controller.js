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
        const query = req.body;
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
        const {name, place, supplier, category, stock} = req.body;
        const created_at = new Date();
        const code = 'DEV' + Date.now()
        const device = await new Device({name, code, place, supplier, category, stock, created_at, available:true, status: true});
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
        await existDevice(device.name, id )
        await Device.findByIdAndUpdate(id,device);


        res.status(200).json({msg:'Successful request', device});
    }catch (error){
        if (error.toString().includes('Already exists') ){
            res.status(400).json({msg: 'Already exists'})
        }else{
            res.status(500).json(error);
            console.log(error);
        }
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

deviceRouter.post('/devices',[
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
    check('name', 'Missing fields').not().isEmpty(),
    check('name').custom((name)=>existDevice(name)),
    check('place').not().isEmpty().withMessage('Missing fields'),
    check('place').isMongoId().withMessage('Invalid fields'),
    check('place').custom(validateIdPlace).withMessage('Invalid fields'),
    check('supplier', 'Missing fields').not().isEmpty(),
    check('supplier').isMongoId().withMessage('Invalid fields'),
    check('supplier').custom(validateIdSupplier).withMessage('Invalid fields'),
    check('category').not().isEmpty().withMessage('Missing fields'),
    check('category').isMongoId().withMessage('Invalid fields'),
    check('category').custom(validateIdCategory).withMessage('Invalid fields'),
    check('stock').not().isEmpty().withMessage('Missing fields'),
    check('stock').isNumeric().withMessage('Invalid fields'),
    validateMiddlewares
 ], insert)
deviceRouter.put('/:id',[
    validateJWT,
    check('name', 'Missing fields').not().isEmpty(),
    check('place').not().isEmpty().withMessage('Missing fields'),
    check('place').isMongoId().withMessage('Invalid fields'),
    check('place').custom(validateIdPlace).withMessage('Invalid fields'),
    check('supplier', 'Missing fields').not().isEmpty(),
    check('supplier').isMongoId().withMessage('Invalid fields'),
    check('supplier').custom(validateIdSupplier).withMessage('Invalid fields'),
    check('category').not().isEmpty().withMessage('Missing fields'),
    check('category').isMongoId().withMessage('Invalid fields'),
    check('category').custom(validateIdCategory).withMessage('Invalid fields'),
    check('stock').not().isEmpty().withMessage('Missing fields'),
    check('stock').isNumeric().withMessage('Invalid fields'),
    check('id','Invalid id').isMongoId(),
    check('id').custom(validateIdDevice),
    validateMiddlewares
],update);

deviceRouter.put('/image/:id',[
    validateJWT,
    check('id','Invalid id').isMongoId(),
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