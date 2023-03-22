const bcrypt = require('bcryptjs');
const {validationResult} = require("express-validator");

const validateError = (error) =>{
    switch (error.message){
        case 'Wrong type':
            return 'Review request fields';
        case 'Missing fields':
            return 'Validate fields';
        case 'Nonexistent role':
            return 'Role not registered';
        case 'Nothing found':
            return 'No data found';
        case 'Password mismatch':
            return 'Credentials mismatch';
        case 'User disabled':
            return 'User disabled';
        default:
            return 'Review request';
    }
}

const validateMiddlewares = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    next();
}
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(15);
    return await bcrypt.hash(password, salt);
};

const validatePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    validateError,
    hashPassword,
    validatePassword,
    validateMiddlewares
};