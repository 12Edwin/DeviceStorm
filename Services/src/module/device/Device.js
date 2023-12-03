const mongoose = require("mongoose");
const { model} = require('mongoose');


const deviceSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        required: true
    },
    place:{
        type: String,
        required: true
    },
    supplier:{
        type: String,
        required: true
    },
    available:{
        type: Boolean,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    img:{
        type: String,
    }
});

deviceSchema.methods.toJSON = function (){
    const {_id, __v, ... device} = this.toObject();
    device.uid = _id;
    return device;
}

module.exports = model('Device',deviceSchema);