const User = require("../module/user/User");
const Device = require('../module/device/Device');
const Role = require('../module/role/Role');
const Request = require('../module/request/Request');
const Category = require('../module/category/Category');
const Place = require('../module/place/Place')
const Supplier = require('../module/supplier/Supplier')
const jwt = require('jsonwebtoken');

const validateEmail = async (email = '') => {
    const emailExist = await User.findOne({ email });
    if (emailExist) {
        throw new Error('Correo registrado anteriormente');
    }
}

const validateId = async (id = '') => {
    const idExist = await User.findById(id);
    if (!idExist) {
        throw new Error('Not found');
    }
}

const validateIdDevice = async (id = '') => {
    const idExist = await Device.findById(id);
    if (!idExist) {
        throw new Error('Not found');
    }
}

const validateStock = async (ids) => {
    try {
        const devices = await Device.find({});

        ids.forEach((idDevice) => {
            const device = devices.findIndex(dev => dev.id === idDevice);

            if (device !== -1 && devices[device].stock === 0) {
                throw new Error('Not enough stock');
            }

            if (device !== -1) {
                devices[device].stock -= 1;
            }
        });


    } catch (error) {
        console.error('Error al validar el stock:', error);
        throw error;
    }
};
const validateIdRole = async (id = '') => {
    const idExist = await Role.findById(id);
    if (!idExist) {
        throw new Error('Not found');
    }
}
const validateIdCategory = async (id = '') => {
    const idExist = await Category.findById(id);
    if (!idExist) {
        throw new Error('Not found');
    }
}
const validateIdPlace = async (id = '') => {
    const idExist = await Place.findById(id);
    if (!idExist) {
        throw new Error('Not found');
    }
}
const validateIdSupplier = async (id = '') => {
    const idExist = await Supplier.findById(id);
    if (!idExist) {
        throw new Error('Not found');
    }
}
const validateIdRequest = async (id = '') => {
    const idExist = await Request.findById(id);
    if (!idExist) {
        throw new Error('Not found');
    }
}
const validateUpdateStatus = async (status = '') => {
    const allowedStatus = [
        'Activa',
        'Cancelada',
        'Finalizada',
        'Pendiente',
        'Sancion'
    ];

    if (!allowedStatus.includes(status)) {
        return res.status(403).json({ msg: 'Invalid Status' });
    }
}

const validateAdmin = async (req, res = Response, next) => {
    if ('ADMIN_ROLE' !== req.user.role) {
        return res.status(403).json({ msg: 'Forbidden' });
    }
    next();
}
const validateUser = async (req, res = Response, next) => {
    if ('USER_ROLE' !== req.user.role) {
        return res.status(403).json({ msg: 'Forbidden' });
    }
    next();
}

const validateJWT = async (req, res = Response, next) => {
    let token = req.header('x-token');
    if (!token) {
        return res.status(401).json(
            { msg: 'No access token' }
        );
    }
    try {
        if (token.includes('Bearer ')) {
            token = token.replace('Bearer ', '')
        }
        const { uid } = jwt.verify(token, process.env.SECRET);
        req.user = await User.findById(uid);

        next()
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token' });
        console.log(err);
    }
}

const validateDevice = async (device = '') => {
    const [deviceExist, isUnavailable, isEmpty] = await Promise.all([
        Device.findOne({ name: device }),
        Request.findOne({ name: device }),
        Device.findOne({ name: device, status: false })
    ]);
    if (!deviceExist) {
        throw new Error('Libro no encontrado en la base de datos');
    }
    if (isUnavailable) {
        throw new Error('Libro ocupado');
    }
    if (isEmpty) {
        throw new Error('Libro no disponible')
    }
}
const validateDeviceById = async (device = '') => {
    const [deviceExist] = await Promise.all([
        Device.findById({ id: device })
    ]);
    if (!deviceExist) {
        throw new Error('Artículo no encotrado en la bas de datos')
    }
}
const existDevice = async (name, id= '000000000000000000000000') => {
    const exist = await Device.exists({ name: name, _id: { $ne: id } })
    if (exist) {
        throw new Error(`Already exists`);
    }
}

const roles = async (role) => {
    const existRole = await Role.findOne({ name: role });
    if (!existRole) {
        throw new Error(`El rol ${role} no es válido`);
    }
}

const status = async (status) => {
    const existRole = await Status.findOne({ name: status });
    if (!existRole) {
        throw new Error(`El rol ${status} no es válido`);
    }
}

const thereCategoriesInDevices = async (id) => {
    const existDevice = await Device.exists({ category: id })
    if (existDevice) {
        throw new Error('This has devices')
    }
}
const thereDevicesInPlace = async (id) => {
    const existDevice = await Device.exists({ place: id })
    if (existDevice) {
        throw new Error('This has devices')
    }
}
const thereSameCategory = async (name, id = '000000000000000000000000') => {
    const existCategory = await Category.exists({ name: name, _id: { $ne: id } })

    if (existCategory) {
        throw new Error('Already exists')
    }
}
const thereSameSupplier = async (name, id = '000000000000000000000000') => {
    const existSupplier = await Supplier.exists({ name: name, _id: { $ne: id } })

    if (existSupplier) {
        throw new Error('Already exists')
    }
}
const thereSamePlace = async (name, id = '000000000000000000000000') => {
    const existPlace = await Place.exists({ name: name, _id: { $ne: id } })

    if (existPlace) {
        throw new Error('Already exists')
    }
}
const minDevicesForPlace = async (id, capacity) => {
    let totalDevices = 0
    const devices = await Device.find({ place: id })
    for (let device of devices) {
        totalDevices += device.stock
    }
    if (capacity < totalDevices) {
        throw new Error('Capacity is so little')
    }
}

module.exports = {
    validateEmail,
    validateId,
    validateJWT,
    validateAdmin,
    validateUser,
    validateIdDevice,
    validateIdRole,
    validateIdRequest,
    validateIdCategory,
    validateIdPlace,
    validateIdSupplier,
    validateDevice,
    existDevice,
    roles,
    status,
    thereCategoriesInDevices,
    thereSameCategory,
    thereDevicesInPlace,
    thereSameSupplier,
    thereSamePlace,
    minDevicesForPlace,
    validateStock,
    validateUpdateStatus,
}