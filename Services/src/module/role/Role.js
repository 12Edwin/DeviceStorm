const {Schema, model} = require('mongoose');

const roleSchema = Schema({
    name:{
        type: String,
        required: (true,'El tipo es requerido')
    },
    description:{
        type: String
    }
});

roleSchema.methods.toJSON = function (){
    const {_id, __v, ... role} = this.toObject();
    role.uid = _id;
    return role;
}

module.exports =  model('Role',roleSchema);