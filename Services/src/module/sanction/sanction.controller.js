const { Router } = require('express');
const Sancation = require('./Sanction');
const { validateError, validateMiddlewares } = require("../../util/functions");
const { validateJWT, validateIdSupplier } = require("../../helpers/db-validations");
const { check } = require("express-validator");
const User = require('../user/User');

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

const insert = async (req, res = Response) => {
    try {
        const { emailUser, description, returns, idRequest } = req.body;

        const existingSanction = await Sancation.findOne({ idRequest });

        if (existingSanction) {
            return res.status(400).json({ msg: 'Ya existe una sanción para este idRequest' });
        }
        
        const currentDate = new Date();
        currentDate.setUTCHours(0, 0, 0, 0);

        const returnsObj = new Date(returns);
        returnsObj.setUTCHours(0, 0, 0, 0);

        const daysDifference = Math.max(Math.ceil((currentDate.getTime() - returnsObj.getTime()) / (1000 * 3600 * 24)), 0);

        const amount = daysDifference * 60;

        if (daysDifference > 0) {
            const sanction = await new Sancation({
                emailUser,
                description,
                returns: returnsObj,
                days: daysDifference,
                amount,
                status: false,
                idRequest,
            });

            await sanction.save();
            res.status(200).json({ msg: 'Solicitud exitosa', sanction });
        } else {
            res.status(400).json({ msg: 'El usuario entregó a tiempo, no se puede hacer multa' });
        }
    } catch (error) {
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
};

//eliminar sancion por id solo para pruebas
const deleteSanction = async (req, res = Response) => {
    try {
        const { id } = req.params;
        const sanction = await Sancation.findByIdAndDelete(id);
        res.status(200).json({ msg: 'Successful request', sanction });
    }
    catch (error) {
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const changeStatus = async (req, res= Response) =>{
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
}



const sanctionRouter = Router();

sanctionRouter.get('/', [
    validateJWT,
], getAll);

sanctionRouter.post('/', [
    validateJWT,
    check('emailUser', 'The emailUser is required').notEmpty(),
    check('description', 'The description is required').notEmpty(),
    check('returns', 'The returns is required').notEmpty(),
    validateMiddlewares
], insert);


sanctionRouter.delete('/:id', [
    validateJWT,
    check('id', 'The id is required').notEmpty(),
    validateMiddlewares
], deleteSanction);

sanctionRouter.put('/:id', [
    validateJWT,
    check('id', 'The id is required').notEmpty(),
    validateMiddlewares
], changeStatus);


module.exports = { sanctionRouter };

