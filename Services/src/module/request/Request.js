const {Schema, model} = require('mongoose');

const requestSchema = Schema({
    book:{
        type: String,
        required: (true, 'Título del libro necesario'),
    },
    email:{
        type: String,
        required: (true,'Correo requerido')
    },
    created: {
        type: String,
        required: true
    },
    returns:{
        type: String,
        required: (true, 'Fecha de retorno necesaria')
    },
    status:{
        type: String,
        required: true,
        enum: ['Active','Canceled','Finished','Pending']
    }

});

requestSchema.methods.toJSON = function (){
    const { __v, _id, ... request } = this.toObject();
    request.uid = _id;
    return request;
}

module.exports = model('Request', requestSchema);