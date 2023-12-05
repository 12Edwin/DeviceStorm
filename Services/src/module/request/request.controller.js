const { Router } = require("express");
const { validateError, validateMiddlewares } = require("../../util/functions");
const Request = require('./Request');
const { validateJWT, validateIdRequest, validateDevice, status } = require("../../helpers/db-validations");
const { check } = require("express-validator");
const { mailer, creatT, sendMail } = require("../email/mailer")
const getAll = async (req, res = Response) => {
    try {
        const query = req.query;
        const [requests, total] = await Promise.all([
            Request.find(query),
            Request.countDocuments()
        ]);

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
        console.log("email: " + email);
        const response = await Request.aggregate([
            {
                $match: {
                    user: email,
                }
            }
        ]
        );

        res.status(200).json(response);
    } catch (error) {
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const insert = async (req, res = Response) => {
    try {
        const { device, email, returns } = req.body;
        const created_at = new Date().toISOString().split('T')[0];
        const request = await new Request({
            device,
            user: email,
            quantity: 1,
            returns,
            status: 'Pending',
            created_at,
            starts: created_at,
        })
        //await request.save();
        sendMail(email,"Nueva solicitud", "Mensaje del cuerpo del correo");
        res.status(200).json({ msg: 'Successful request', request });
    } catch (error) {
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }

}
const update = async (req, res = Response) => {
    console.log("Llegó")
    try {
        const { status } = req.body;
        const { id } = req.params;
        const [updated, request] = await Promise.all([
            Request.findByIdAndUpdate(id, { status: status }),
            Request.findById(id)
        ]);
        res.status(200).json({ msg: 'Successful request', request, status });
    } catch (error) {
        const message = validateError(error);
        res.status(400).json(message);
        console.log(error);
    }
}

const requestRouter = Router();

requestRouter.get('/', [
    validateJWT
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
    check('device', 'Título del libro necesario').not().isEmpty(),
    check('device').custom(validateDevice),
    check('email', 'El correo es necesario').not().isEmpty(),
    check('email', 'Correo inválido').isEmail(),
    check('returns', 'Fecha de retorno necesaria').not().isEmpty(),
    validateMiddlewares
], insert);

requestRouter.put('/:id', [
    validateJWT,
    check('id', 'El id no es de mongo').isMongoId(),
    check('id').custom(validateIdRequest),
    check('status').custom(status),
    validateMiddlewares
], update);

//requestRouter.delete('/:id',[],deletes);

module.exports = { requestRouter }