const mongoose = require("mongoose");
const { model} = require('mongoose');


const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    gender:{
        type:String,
        required:true
    }
});

const deviceSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    publication:{
        type: String,
        required: true
    },
    editorial:{
        type: String,
    },
    price:{
        type: Number,
        required: true
    },
    status:{
        type: Boolean,
        required: true
    },
    category:{
        type: categorySchema,
        required: true
    },
    resume:{
        type: String,
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