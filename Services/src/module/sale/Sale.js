const {Schema, model} = require('mongoose');

const saleSchema = Schema({
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
    status:{
        type: Boolean,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    pay:{
        type:Number,
        required:true
    }

});

saleSchema.methods.toJSON = function (){
    const { __v, _id, ... sale } = this.toObject();
    sale.uid = _id;
    return sale;
}

module.exports = model('Sale', saleSchema);