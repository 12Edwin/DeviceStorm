const {userRouter} = require ('./user/user.controller');
const {authRouter} = require("./auth/auth.controller");
const {bookRouter} = require('./book/book.controller');
const {roleRouter} = require('./role/role.controller');
const {requestRouter} = require('./request/request.controller');
const {statusRouter} = require('./status/status.controller');
const {saleRouter} = require('./sale/sale.controller');
const {categoryRouter} = require('./category/category.controller')

module.exports = {
    userRouter,
    authRouter,
    bookRouter,
    roleRouter,
    requestRouter,
    statusRouter,
    saleRouter,
    categoryRouter
}