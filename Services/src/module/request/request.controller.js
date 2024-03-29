const { Router } = require("express");
const { validateError, validateMiddlewares } = require("../../util/functions");
const Request = require('./Request');
const { validateJWT, validateIdRequest, validateIdDevice, status, validateStock, validateUpdateStatus } = require("../../helpers/db-validations");
const { check } = require("express-validator");
const Device = require("../device/Device");
//const { mailer, creatT, sendMail } = require("../email/mailer")
const getAll = async (req, res = Response) => {
    try {
        const query = req.query;
        const [requests, total] = await Promise.all([
            Request.aggregate([
                {
                    $unwind: '$devices',
                },
                {
                    $lookup: {
                        from: 'devices', // Reemplaza con el nombre real de tu colección de devices
                        localField: 'devices',
                        foreignField: '_id',
                        as: 'devices.deviceInfo',
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        requestInfo: {
                            $first: '$$ROOT', // Preserva la información original del Request
                        },
                        devices: {
                            $push: '$devices',
                        },
                    },
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: ['$requestInfo', { devices: '$devices' }],
                        },
                    },
                },
            ]
            ).sort({ created_at: -1 }), Request.countDocuments]);

        res.status(200).json({ total, requests });
    } catch (error) {
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const getById = async (req, res = Response) => {
    try {
        const { id } = req.params;
        const request = await Request.findById(id);

        res.status(200).json(request);
    } catch (error) {
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const getByEmail = async (req, res = Response) => {
    try {
        const { email } = req.params;
        const response = await Request.aggregate([
            {
                $match: {
                    user: email,
                }
            },
            {
                $unwind: '$devices',
            },
            {
                $lookup: {
                    from: 'devices', // Reemplaza con el nombre real de tu colección de devices
                    localField: 'devices',
                    foreignField: '_id',
                    as: 'devices.deviceInfo',
                },
            },
            {
                $group: {
                    _id: '$_id',
                    requestInfo: {
                        $first: '$$ROOT', // Preserva la información original del Request
                    },
                    devices: {
                        $push: '$devices',
                    },
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$requestInfo', { devices: '$devices' }],
                    },
                },
            },
        ]
        ).sort({created_at: -1});

        res.status(200).json(response);
    } catch (error) {
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const insert = async (req, res = Response) => {
    try {
        const { devices, email, returns } = req.body;
        const created_at = new Date().toISOString().split('T')[0];
        const request = await new Request({
            devices: [...devices],
            user: email,
            returns,
            status: 'Pendiente',
            created_at,
            starts: created_at,
        })
        updateStock(devices);
        await request.save();
        //sendMail(email,"Nueva solicitud", "Mensaje del cuerpo del correo");
        res.status(200).json({ msg: 'Successful request', request });
    } catch (error) {
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }

}

const updateStock = async (devices) => {
    for (const element of devices) {
        try {
            const device = await Device.findById(element);
            if (device) {
                device.stock -= 1,
                    await device.save();
            }
        } catch (err) {

        }
    }
}

const update = async (req, res = Response) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const returnStocks = [
            'Cancelada',
            'Finalizada'
        ]
        const notReturnStocks = [
            'Pendiente',
            'Activa',
            'Sancion'
        ]
        const requestI = await Request.findById(id);
        if (!returnStocks.includes(requestI.status) && returnStocks.includes(status)) {
            for (const deviceId of requestI.devices) {
                const device = await Device.findById(deviceId);
                device.stock += 1;
                await device.save();
            }
        }
        if (!notReturnStocks.includes(requestI.status) && notReturnStocks.includes(status)) {
            for (const deviceId of requestI.devices) {
                const device = await Device.findById(deviceId);
                device.stock -= 1;
                await device.save();
            }
        }

        const [updated, request] = await Promise.all([
            Request.findByIdAndUpdate(id, { status: status }),
        ]);
        res.status(200).json({ msg: 'Successful request', request, status });
    } catch (error) {
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const sancionar = async (req, res = Response) => {
    try {
        const { sanction } = req.body;
        const { id } = req.params;
        const [updated, request] = await Promise.all([
            Request.findByIdAndUpdate(id, { sanction, sanction }),
            Request.findById(id)
        ]);
        res.status(200).json({ msg: 'Successful request', request, status });
    } catch (err) {
        const message = validateError(err);
        res.status(400).json(message);
        console.log(err);
    }
}

const requestRouter = Router();

requestRouter.get('/', [
    //validateJWT
], getAll);

requestRouter.get('/id/:id', [
    validateJWT,
    check('id', 'El id no es de mongo').isMongoId(),
    check('id').custom(validateIdRequest),
    validateMiddlewares
], getById);

requestRouter.get('/email/:email', [
    validateJWT,
    check('email', 'Correo inválido').isEmail(),
    validateMiddlewares
], getByEmail);

requestRouter.post('/', [
    validateJWT,
    check('devices', 'Título del libro necesario').not().isEmpty(),
    check('devices').custom(validateIdDevice),
    check('devices').custom(validateStock),
    check('email', 'El correo es necesario').not().isEmpty(),
    check('email', 'Correo inválido').isEmail(),
    check('returns', 'Fecha de retorno necesaria').not().isEmpty(),
    validateMiddlewares
], insert);

requestRouter.put('/status/:id', [
    validateJWT,
    check('id', 'El id no es de mongo').isMongoId(),
    check('id').custom(validateIdRequest),
    check('status').custom(validateUpdateStatus),
    validateMiddlewares
], update);

requestRouter.put('/sanction/:id', [
    validateJWT,
    check('id', 'El id no es de mongo').isMongoId(),
    check('id').custom(validateIdRequest),
    check('sanction', 'La sancion es requirida').not().isEmpty(),
    validateMiddlewares
], sancionar)
//requestRouter.delete('/:id',[],deletes);

module.exports = { requestRouter }
