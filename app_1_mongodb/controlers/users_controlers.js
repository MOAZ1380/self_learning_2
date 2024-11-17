const User = require('../schmea/users_models');
const httpstatus = require('../utils/http_status');
const asyncWrapper = require('../middelware/asyncWrapper');
const AppError = require('../utils/appsError');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const generatejwt = require('../utils/generatejwt')

const getallusers = asyncWrapper(
    async(req, res, next) => {
    // pagination 
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;

    let users = await User.find({}, {"__v" : false, "password" : false}).limit(limit).skip(skip); // pagination
    res.json({status : httpstatus.SUCCESS, data : {users}});
})

const userRegister = asyncWrapper(
    async(req, res, next) => {
    const{ firstName, lastName, email, password, role } = req.body;
    const oldUser = await User.findOne({ email : email});
    if(oldUser){
        let error = AppError.create("user already exists",  400, httpstatus.FAIL);
        return next(error)
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        firstName,
        lastName,
        email,
        password : hashpassword,
        role,
        avatar : req.file.filename,
    });
    const my_token = await generatejwt({email: newUser.email, id: newUser._id, role: newUser.role }); // 
    newUser.token = my_token;
    await newUser.save()
    res.json({status : httpstatus.SUCCESS, data : {user : newUser}});
});

const usreLogin = asyncWrapper(async(req, res, next) => {
    const {email, password} = req.body;
    
    if(!email && !password){
        let error = AppError.create("email and password are required",  400, httpstatus.FAIL);
        return next(error);
    }

    const user = await User.findOne({email : email});
    if(!user){
        let error = AppError.create("user not found",  400, httpstatus.FAIL);
        return next(error);
    }
    
    const matchPassword = await bcrypt.compare(password, user.password);
    
    if(user && matchPassword){
        const my_token = await generatejwt({email: user.email, id: user._id, role: user.role });
        return res.json({status : httpstatus.SUCCESS, data : {my_token}});
    } else {
        let error = AppError.create("something wrong",  400, httpstatus.ERROR);
        return next(error);
    }

});


module.exports = {
    getallusers,
    usreLogin,
    userRegister,
}