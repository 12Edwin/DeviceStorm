const mongoose = require('mongoose');

require('dotenv').config();

const dbConnection = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_CNN,{
            useNewUrlParser : true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    }catch (error){
        console.log(error);
        throw new Error('Error in the data base');
    }
}

module.exports = {
    dbConnection
}