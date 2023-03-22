const {Schema, model} = require('mongoose');

const statusSchema = Schema({
    name:{
        type: String,
        required: (true,'El tipo es requerido')
    },
    description:{
        type: String
    }
});

statusSchema.methods.toJSON = function (){
    const {_id, __v, ... status} = this.toObject();
    status.uid = _id;
    return status;
}

module.exports =  model('Status',statusSchema);