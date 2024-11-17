const httpstatus = require('../utils/http_status')
const AppError = require('../utils/appsError');

const allowed = ['admin', 'manager'];
module.exports = ((req, res, next) => {
        console.log("Role received:", req.currentUser.role);
        if(!allowed.includes(req.currentUser.role)){
            let error = AppError.create("user not allowed here",  401, httpstatus.FAIL);
            return next(error);
        }
        next();
});