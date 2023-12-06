const { Router } = require('express');
const Sancation = require('./Sanction');
const { validateError, validateMiddlewares } = require("../../util/functions");
const { validateJWT, validateIdSupplier } = require("../../helpers/db-validations");
const { check } = require("express-validator");

const getAll = async (req, res = Response) => {
    try {
        const quey = req.query;
        const [sanctions, total] = await Promise.all([
            Sancation.find(quey),
            Sancation.countDocuments(quey)
        ]);
        res.status(200).json({ msg: 'Successful request', total, sanctions });
    } catch (error) {
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

/*const getByUser = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        const sanctions = await Sancation.find({user: id});
        res.status(200).json({msg:'Successful request', sanctions});
    }catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}*/

const insert = async (req, res = Response) => {
    try {
        const { idUser, description, dueDate } = req.body;

        // Obtén la fecha actual en formato UTC sin horas, minutos, segundos y milisegundos
        const currentDate = new Date();
        currentDate.setUTCHours(0, 0, 0, 0);

        // Asegúrate de que dueDate sea un objeto de tipo Date en formato UTC sin horas, minutos, segundos y milisegundos
        const dueDateObj = new Date(dueDate);
        dueDateObj.setUTCHours(0, 0, 0, 0);

        // Calcular la diferencia en días utilizando getTime() para obtener milisegundos y convertir a días
        const daysDifference = Math.max(Math.ceil((currentDate.getTime() - dueDateObj.getTime()) / (1000 * 3600 * 24)), 0);

        // Calcular el monto automáticamente basado en la cantidad de días de atraso
        const amount = daysDifference * 60;

        console.log(`La diferencia en días es: ${daysDifference}`);
        console.log(`El monto calculado es: ${amount}`);
        
        const sanction = await new Sancation({
            idUser,
            description,
            dueDate: dueDateObj,
            days: daysDifference,
            amount,
            status: true,
        });

        await sanction.save();
        res.status(200).json({ msg: 'Solicitud exitosa', sanction });
    } catch (error) {
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
};


/*const changeStatus = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        const sanction = await Sancation.findById(id);
        sanction.status = !sanction.status;
        await sanction.save();
        res.status(200).json({msg:'Successful request', sanction});
    }
    catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}*/

const deletes = async (req, res= Response) =>{
    try {
        const {id} = req.params;
        await Sancation.findByIdAndDelete(id);
        res.status(200).json({msg:'Status deleted'});
    }
    catch (error){
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const sanctionRouter = Router();

sanctionRouter.get('/', [
    //validateJWT,
], getAll);

sanctionRouter.post('/', [
    //validateJWT,
    check('idUser', 'The idUser is required').notEmpty(),
    check('description', 'The description is required').notEmpty(),
    check('dueDate', 'The dueDate is required').notEmpty(),
    validateMiddlewares
], insert);

sanctionRouter.delete('/:id', [
    //validateJWT,
    check('id').custom(validateIdSupplier),
    validateMiddlewares
], deletes);

module.exports = { sanctionRouter };

