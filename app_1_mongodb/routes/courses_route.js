const express = require("express");
const router = express.Router();
const {validayionSchema} = require('../middelware/validation');
const coursesContrloler = require('../controlers/courses._controler');
const vrifytoken = require('../middelware/verifyToken')
const verifyUser = require('../middelware/verifyUser')


router.route('/')
    .get(vrifytoken, coursesContrloler.get_all_courses)
    .post(vrifytoken,verifyUser, validayionSchema(),
    coursesContrloler.add_course);


router.route('/:courseId')
                .get(vrifytoken, coursesContrloler.get_course)
                .patch(vrifytoken,verifyUser, coursesContrloler.update_course)
                .delete(vrifytoken, verifyUser, coursesContrloler.delete_course);

module.exports = router;
