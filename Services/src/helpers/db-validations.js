const User = require("../module/user/User");
const Book = require('../module/book/Book');
const Role = require('../module/role/Role');
const Request = require('../module/request/Request');
const Status = require('../module/status/Status');
const Category = require('../module/category/Category');
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

const validateIdBook = async (id = '') =>{
    const idExist = await Book.findById(id);
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

const validateIdStatus = async (id = '') =>{
    const idExist = await Status.findById(id);
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
    const token = req.header('x-token');
    if (!token){
        return res.status(401).json(
            {msg: 'Acceso denegado'}
        );
    }
    try {
        const {uid} = jwt.verify(token,process.env.SECRET);
        req.user = await User.findById(uid);

        next()
    }catch (err){
        res.status(400).json({message:'Acceso denegado'});
        console.log(err);
    }
}

const validateBook = async (book = '') =>{
    const [bookExist, isUnavailable, isEmpty] = await Promise.all([
        Book.findOne({name:book}),
        Request.findOne({name:book}),
        Book.findOne({name:book, status:false})
    ]);
    if (!bookExist){
        throw new Error('Libro no encontrado en la base de datos');
    }
    if(isUnavailable){
        throw new Error('Libro ocupado');
    }
    if (isEmpty){
        throw new Error('Libro no disponible')
    }
}

const validateBookBought = async (book = '') =>{
    const [bookExist, isUnavailable] = await Promise.all([
        Book.findOne({name:book}),
        Book.findOne({name:book, status:false})
    ]);
    if (!bookExist){
        throw new Error('Libro no encontrado en la base de datos');
    }
    if(isUnavailable){
        throw new Error('Libro no disponible');
    }
}

const existBook = async (book) =>{
    const exist = await Book.findOne({name:book});
    if (exist){
        throw  new Error(`El libro ${book} ya está registrado`);
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
    validateIdBook,
    validateIdRole,
    validateIdRequest,
    validateIdCategory,
    validateBook,
    existBook,
    validateIdStatus,
    roles,
    status,
    validateBookBought
}