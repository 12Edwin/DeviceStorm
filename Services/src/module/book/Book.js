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

const bookSchema = new mongoose.Schema({
    name:{
        type: String,
        required: (true,'Nombre obligaorio')
    },
    author:{
        type: String,
        required: (true, 'Autor obligaorio')
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

bookSchema.methods.toJSON = function (){
    const {_id, __v, ... book} = this.toObject();
    book.uid = _id;
    return book;
}

module.exports = model('Book',bookSchema);