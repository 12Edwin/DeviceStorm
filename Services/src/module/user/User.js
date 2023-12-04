const {Schema, model} = require('mongoose');


const userSchema = Schema ({
    name: {
        type: String,
        required: [true, "El nombre es requerido"]
    },
    lastname: {
        type: String,
        required: [true, "El apellido paterno es requerido"]
    },
    surname: {
        type: String
    },
    email: {
        type: String,
        required: [true,"Correo requerido"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Contraseña requerida"]
    },
    role: {
        type: String,
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
});

userSchema.methods.toJSON = function (){
    const { __v, password, _id, ... user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports= model('User',userSchema);