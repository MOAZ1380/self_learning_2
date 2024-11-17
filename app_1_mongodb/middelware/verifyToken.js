const jwt = require('jsonwebtoken');
const httpstatus = require('../utils/http_status')
const AppError = require('../utils/appsError');
const vrifytoken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];

    if(!authHeader){
        let error = AppError.create("token is required",  401, httpstatus.FAIL);
        return next(error);
    }
    const token = authHeader.split(' ')[1];
    try{
        const decodetoken = jwt.verify(token, process.env.JWT_SECRET); // To see the token with the secret number, whether it is allowed to enter or not
        console.log(decodetoken);
        req.currentUser = decodetoken;
        next();
    } catch (err){
        let error = AppError.create("invalid token",  401, httpstatus.ERROR);
        return next(error);
    }
};

module.exports = vrifytoken;