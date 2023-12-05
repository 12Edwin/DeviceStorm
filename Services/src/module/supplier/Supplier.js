const {Schema, model} = require('mongoose');

const supplierSchema = Schema({
    devices:{
        type: Array
    },
    name:{
        type: String,
        required: true
    },
    direction:{
        type: String,
        required: true
    },
    contact:{
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    status:{
        type: Boolean,
        required: true,
    }

});

supplierSchema.methods.toJSON = function (){
    const { __v, _id, ... supplier } = this.toObject();
    supplier.uid = _id;
    return supplier;
}

module.exports = model('Supplier', supplierSchema);