const {app} = require('./config/express');
const {dbConnection} = require("./util/mongoDB");

const main = () =>{
    app.listen(app.get('port'));
    console.log(`Server running in the port ${app.get('port')}/`);

}

main();
const connected = async ()=>{
    await dbConnection();
}
connected().then(r => console.log('Successful Connection'))
.catch(err=>console.log('Error, cannot connect to the database---------------------' +
    '\n\n'+err))