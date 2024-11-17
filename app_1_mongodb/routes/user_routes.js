const express = require("express");
const multer  = require('multer');
const path  = require('path')
const AppError = require('../utils/appsError');
const httpstatus = require('../utils/http_status');



function fileFilter (req, file, cb) {
    const imageType = file.mimetype.split('/')[0];
    if(imageType == 'image'){
        return cb(null, true);
    } else {
        return cb(AppError.create("file must be image",  400, httpstatus.FAIL), false);
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const newFilename = "user" + '_' + Date.now() + path.extname(file.originalname);
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage,
    fileFilter,
});


const router = express.Router();
const usercontroler = require('../controlers/users_controlers');
const vrifytoken = require('../middelware/verifyToken')

// get all users

// regiser

// login

router.route('/')
            .get(vrifytoken, usercontroler.getallusers);

router.route('/login')
            .post(usercontroler.usreLogin)

router.route('/register')
            .post(upload.single('avatar'), usercontroler.userRegister)

module.exports = router;