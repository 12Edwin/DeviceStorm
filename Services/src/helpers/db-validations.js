const User = require("../module/user/User");
const Device = require('../module/device/Device');
const Role = require('../module/role/Role');
const Request = require('../module/request/Request');
const Category = require('../module/category/Category');
const Place = require('../module/place/Place')
const Supplier = require('../module/supplier/Supplier')
const jwt = require('jsonwebtoken');

const validateEmail = async (email = '') =>{
    const emailExist = await User.findOne({email});
    if (emailExist){
        throw new Error('Correo registrado anteriormente');
    }
}

const validateId = async (id = '') =>{
    const idExist = await User.findById(id);
    if (!idExist){
        throw new Error('Id no encontrado en la base de datos');
    }
}

const validateIdDevice = async (id = '') =>{
    const idExist = await Device.findById(id);
    if (!idExist){
        throw new Error('Id no encontrado en la base de datos');
    }
}

const validateIdRole = async (id = '') =>{
    const idExist = await Role.findById(id);
    if (!idExist){
        throw new Error('Id no encontrado en la base de datos');
    }
}
const validateIdCategory = async (id = '') =>{
    const idExist = await Category.findById(id);
    if (!idExist){
        throw new Error('Id no encontrado en la base de datos');
    }
}
const validateIdPlace = async (id = '') =>{
    const idExist = await Place.findById(id);
    if (!idExist){
        throw new Error('Id no encontrado en la base de datos');
    }
}
const validateIdSupplier = async (id = '') =>{
    const idExist = await Supplier.findById(id);
    if (!idExist){
        throw new Error('Id no encontrado en la base de datos');
    }
}
const validateIdRequest = async (id = '') =>{
    const idExist = await Request.findById(id);
    if (!idExist){
        throw new Error('Id no encontrado en la base de datos');
    }
}

const validateAdmin = async (req, res = Response, next) =>{
    if ('ADMIN_ROLE' !== req.user.role){
        return res.status(401).json({msg:'No autorizado'});
    }
    next();
}
const validateUser = async (req, res = Response, next) =>{
    if ('USER_ROLE' !== req.user.role){
        return res.status(401).json({msg:'No autorizado'});
    }
    next();
}

const validateJWT = async (req, res = Response, next) =>{
    let token = req.header('x-token');
    if (!token){
        return res.status(401).json(
            {msg: 'Acceso denegado'}
        );
    }
    try {
        console.log(token)
        if (token.includes('Bearer ')){
            token = token.replace('Bearer ', '')
        }
        const {uid} = jwt.verify(token,process.env.SECRET);
        req.user = await User.findById(uid);

        next()
    }catch (err){
        res.status(400).json({message:'Acceso denegado'});
        console.log(err);
    }
}

const validateDevice = async (device = '') =>{
    const [deviceExist, isUnavailable, isEmpty] = await Promise.all([
        Device.findOne({name:device}),
        Request.findOne({name:device}),
        Device.findOne({name:device, status:false})
    ]);
    if (!deviceExist){
        throw new Error('Libro no encontrado en la base de datos');
    }
    if(isUnavailable){
        throw new Error('Libro ocupado');
    }
    if (isEmpty){
        throw new Error('Libro no disponible')
    }
}

const existDevice = async (device) =>{
    const exist = await Device.findOne({name:device});
    if (exist){
        throw  new Error(`El libro ${device} ya está registrado`);
    }
}

const roles = async (role) =>{
    const existRole = await Role.findOne({name:role});
    if (!existRole){
        throw new Error(`El rol ${role} no es válido`);
    }
}

const status = async (status) =>{
    const existRole = await Status.findOne({name:status});
    if (!existRole){
        throw new Error(`El rol ${status} no es válido`);
    }
}

module.exports ={
    validateEmail,
    validateId,
    validateJWT,
    validateAdmin,
    validateUser,
    validateIdDevice,
    validateIdRole,
    validateIdRequest,
    validateIdCategory,
    validateIdPlace,
    validateIdSupplier,
    validateDevice,
    existDevice,
    roles,
    status,
}