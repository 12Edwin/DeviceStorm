const mongoose = require("mongoose");
const {Schema, model} = require('mongoose');


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


categorySchema.methods.toJSON = function (){
    const {_id, __v, ... category} = this.toObject();
    category.uid = _id;
    return category;
}

module.exports = model('Category',categorySchema);