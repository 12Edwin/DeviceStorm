const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const requestSchema = Schema({
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
        required: true,
    },
    sanction: {
        type: String
    },
    quantity: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    starts: {
        type: Date,
        required: true
    },
    returns: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Canceled', 'Finished', 'Pending', 'Sanction']
    }

});

requestSchema.methods.toJSON = function () {
    const { __v, _id, ...request } = this.toObject();
    request.uid = _id;
    return request;
}

module.exports = model('Request', requestSchema);