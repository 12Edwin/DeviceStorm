const {userRouter} = require ('./user/user.controller');
const {authRouter} = require("./auth/auth.controller");
const {bookRouter} = require('./device/device.controller');
const {roleRouter} = require('./role/role.controller');
const {requestRouter} = require('./request/request.controller');
const {categoryRouter} = require('./category/category.controller')

module.exports = {
    userRouter,
    authRouter,
    bookRouter,
    roleRouter,
    requestRouter,
    categoryRouter
}