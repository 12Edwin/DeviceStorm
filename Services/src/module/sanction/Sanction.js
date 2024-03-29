const {Schema, model} = require('mongoose');

const sanctionSchema = Schema({
    emailUser: {
        type: String,
        required: true
    },
    idRequest: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    returns: {
        type: Date,
        required: true
    },
    days: {
        type: Number,
        required: true,
        min: 0  // Evita valores negativos
    },
    amount: {
        type: Number,
        required: true,
        min: 0  // Evita valores negativos
    },
    status: {
        type: Boolean,
        required: true,
    }
});

sanctionSchema.methods.toJSON = function (){
    const { __v, _id, ... sanction } = this.toObject();
    sanction.uid = _id;
    return sanction;
}

module.exports = model('Sanction', sanctionSchema);
