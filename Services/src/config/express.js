const express = require('express');
const cors = require('cors');
const {userRouter, authRouter, bookRouter, roleRouter, requestRouter, categoryRouter, supplierRouter, placeRouter} = require("../module/routes");
const {deviceRouter} = require("../module/device/device.controller");

require('dotenv').config()

const app = express();
app.set('port',process.env.PORT || 3000);

app.use(cors({
    origins : '*'
}));

app.use(express.json({limit:'50mb'}));

app.get('/',(request,response) =>{
    response.send('Bienvenido a REPADE');
});


app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/device',deviceRouter);
app.use('/api/role',roleRouter);
app.use('/api/request',requestRouter);
app.use('/api/category',categoryRouter);
app.use('/api/supplier',supplierRouter);
app.use('/api/place', placeRouter);


module.exports = {
    app
};