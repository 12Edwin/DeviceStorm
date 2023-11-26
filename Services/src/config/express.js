const express = require('express');
const cors = require('cors');
const {userRouter, authRouter, bookRouter, roleRouter, requestRouter, categoryRouter} = require("../module/routes");
const {validateBookBought} = require("../helpers/db-validations");

require('dotenv').config()

const app = express();
app.set('port',process.env.PORT || 3000);

app.use(cors({
    origins : '*'
}));

app.use(express.json({limit:'50mb'}));

app.get('/',(request,response) =>{
    response.send('Bienvenido a la biblioteca');
});


app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/device',bookRouter);
app.use('/api/role',roleRouter);
app.use('/api/request',requestRouter);
app.use('/api/category',categoryRouter);


module.exports = {
    app
};