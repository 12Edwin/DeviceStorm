const jwt = require('jsonwebtoken');

const generateJWT = (uid) =>{
    return new Promise((resolve,reject) =>{

        const payload = {uid};
        jwt.sign(payload, process.env.SECRET,{
            expiresIn: '4h'
        },(err,token) =>{
            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            }else {
                resolve(token);
            }
        });
    });
}

const validateToken = (token) => {
    let result = { valid: false, message: '' };
    try {
        jwt.verify(token, process.env.SECRET);
        result.valid = true;
    } catch (error) {
        result.message = error.message;
    }
    return result;
}

module.exports = {
    generateJWT,
    validateToken
}