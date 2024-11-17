const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config()               // for protect
const cors = require('cors');   //  for fronted because port is different


const courses_router = require('./routes/courses_route');
const user_router = require('./routes/user_routes');
const httpstatus = require('./utils/http_status')
const path = require('path')
const asyncFn = require('./middelware/asyncWrapper');


const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));   // photo // http://localhost:6000/uploads/name.png



const url = process.env.MONGO_URL;  // protect the pass and user for db 


mongoose.connect(url)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));



app.use(cors());   // for fronted because port is different (cors)
app.use(express.json());
app.use('/api/courses', courses_router)  // /api/courses/.....
app.use('/api/users', user_router);  // /api/users/.....


// global middleware fornot found router
app.all('*', (req, res, next) => {       
    res.json({status : httpstatus.ERROR, message : 'this resource is not available'}); // if The page is not found in route.
});


// global error handler
app.use((err, req, res, next) => {
    const statusCode = err.status_code || 500;
    const statusText = err.status_text || "Internal Server error"; 
    const message = err.message || "An unexpected error occurred.";

    res.status(statusCode).json({
        status: statusText,
        message: message
    });
});

app.listen(process.env.PORT || 6000, () => {
    console.log(`listening on port ${process.env.PORT}`);
})
