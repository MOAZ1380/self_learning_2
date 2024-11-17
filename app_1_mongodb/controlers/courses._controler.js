let {courses} = require('../data/courses');
const Course = require('../schmea/courses_modes')
const httpstatus = require('../utils/http_status')
const asyncWrapper = require('../middelware/asyncWrapper')
const {validationResult} = require('express-validator')
const AppError = require('../utils/appsError');



const get_all_courses = asyncWrapper(
    async(req, res, next) => {
    // pagination 
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;

    let course = await Course.find({}, {"__v" : false}).limit(limit).skip(skip); // pagination
    res.json({status : httpstatus.SUCCESS, data : {course}});
})

const get_course = asyncWrapper(
    async(req, res, next) => {
    let course = await Course.find({_id : req.params.courseId}, {"__v" : false});
    if(!course){
        let error = AppError.create("not found",  400, httpstatus.FAIL);
        return next(error);
    }
    return res.json({status : httpstatus.SUCCESS, data : {course}});
    
})

const add_course = asyncWrapper(
    async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = AppError.create(errors.array(),  400, httpstatus.FAIL);
        return next(error)
    }
    const course = new Course(req.body);
    await course.save();
    res.json({status : httpstatus.SUCCESS, data : {course}});
})

const update_course = asyncWrapper(
    async (req, res, next) => {
    const courseId = req.params.courseId;
    let course = await Course.findByIdAndUpdate(courseId, req.body, { new: true, runValidators: true });
    if (!course) {
        let error = AppError.create('course not found',  404, httpstatus.FAIL);
        return next(error)
    }
    res.json({status : httpstatus.SUCCESS, data : {course_update : course}});
});

const delete_course = asyncWrapper( 
    async (req, res, next) => {
    const courseId = req.params.courseId;
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
        let error = AppError.create('course not found',  404, httpstatus.FAIL);
        return next(error)
    }
    res.json({status : httpstatus.SUCCESS, data : {course_delete : course}});    
});


module.exports = {
    get_all_courses,
    get_course,
    add_course,
    update_course,
    delete_course
}

