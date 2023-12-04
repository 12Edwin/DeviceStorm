const {Schema, model} = require('mongoose');

const placeSchema = Schema({
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
    capacity:{
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

placeSchema.methods.toJSON = function (){
    const { __v, _id, ... place } = this.toObject();
    place.uid = _id;
    return place;
}

module.exports = model('Place', placeSchema);